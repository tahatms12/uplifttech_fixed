import crypto from 'crypto';
import type { Handler, HandlerEvent, HandlerResponse, Config } from '@netlify/functions';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { jsonResponse, methodNotAllowed, notFound, parseJsonBody, serverError } from './_lib/http';
import { getAdminEmails, getEnv } from './_lib/env';
import { appendRow, readAll, upsertBy } from './_lib/csvStore';
import {
  AuthenticatedUser,
  CertificateRow,
  CompletionRow,
  LessonTimeRow,
  QuizAttemptRow,
  RateLimitRow,
  UserRow,
} from './_lib/types';
import {
  getClientIp,
  hashIp,
  parseCookies,
  requestIsHttps,
  safeCompare,
  serializeCookie,
  signJwt,
  verifyJwt,
  verifyOrigin,
} from './_lib/security';
import { courseTitle, getCatalogVersion, getCurriculumVersion, getQuiz, listCatalogCourses } from './_lib/catalog';
import { buildProgress, getCourseProgress, loadTrainingData, type CourseProgressSummary } from './_lib/completion';

interface TrainingConfig {
  jwtSecret: string;
  demoKey?: string;
  demoUsernames: string[];
  cookieName: string;
  trainingOrigins: string[];
  adminEmails: string[];
}

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
const DEMO_SESSION_TTL_SECONDS = 60 * 60 * 8;
let cachedConfig: TrainingConfig | null = null;

function resolveAllowedOrigins(): string[] {
  const configured = (getEnv('TRAINING_APP_ORIGIN') || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  const defaults = [
    process.env.URL,
    process.env.DEPLOY_PRIME_URL,
    'https://uplift-technologies.com',
    'http://localhost:8888',
    'http://127.0.0.1:8888',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ].filter(Boolean) as string[];
  return Array.from(new Set([...configured, ...defaults]));
}

function parseDemoUsernames(value?: string): string[] {
  if (!value) return [];
  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function loadConfig(): TrainingConfig {
  if (cachedConfig) return cachedConfig;
  const jwtSecret = getEnv('TRAINING_JWT_SECRET') as string | undefined;
  const demoKey = (getEnv('demo_key') || getEnv('DEMO_KEY')) as string | undefined;
  const demoUsernames = parseDemoUsernames(getEnv('DEMO_USERNAME') as string | undefined);
  const cookieName = getEnv('TRAINING_COOKIE_NAME', false, 'training_session') as string;
  const trainingOrigins = resolveAllowedOrigins();
  const adminEmails = getAdminEmails();
  const missing: string[] = [];
  if (!jwtSecret) missing.push('TRAINING_JWT_SECRET');
  if (missing.length) {
    const err = new Error('CONFIG_INCOMPLETE');
    (err as any).statusCode = 503;
    (err as any).missing = missing;
    throw err;
  }
  cachedConfig = { jwtSecret, demoKey, demoUsernames, cookieName, trainingOrigins, adminEmails } satisfies TrainingConfig;
  return cachedConfig;
}

function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}

function errorResponse(status: number, message: string): HandlerResponse {
  return jsonResponse(status, { ok: false, error: message });
}

function failureResponse(start: number, code: string, message: string): Promise<HandlerResponse> {
  const elapsed = Date.now() - start;
  const wait = Math.max(0, 350 - elapsed);
  return new Promise((resolve) =>
    setTimeout(() => resolve(jsonResponse(401, { ok: false, code, message })), wait)
  );
}

async function enforceRateLimit(
  event: HandlerEvent,
  key: string,
  windowSeconds: number,
  maxCount: number
): Promise<void> {
  const now = new Date();
  const windowStart = Math.floor(now.getTime() / 1000 / windowSeconds) * windowSeconds;
  await upsertBy(
    'rate_limits.csv',
    (row) => row.key === key,
    (row) => {
      const currentWindow = row ? parseInt(row.window_start, 10) : 0;
      const currentCount = row ? parseInt(row.count || '0', 10) : 0;
      if (currentWindow === windowStart) {
        if (currentCount + 1 > maxCount) {
          throw Object.assign(new Error('RATE_LIMIT'), { statusCode: 429 });
        }
        return {
          ...row!,
          key,
          window_start: windowStart.toString(),
          count: String(currentCount + 1),
          updated_at: now.toISOString(),
        } satisfies RateLimitRow;
      }
      return {
        key,
        window_start: windowStart.toString(),
        count: '1',
        updated_at: now.toISOString(),
      } satisfies RateLimitRow;
    },
    event
  );
}

function requireOrigin(event: HandlerEvent, config: TrainingConfig): HandlerResponse | null {
  if (!verifyOrigin(event, config.trainingOrigins)) {
    return jsonResponse(403, { ok: false, error: 'forbidden' });
  }
  return null;
}

function parseAuth(event: HandlerEvent, config: TrainingConfig): AuthenticatedUser | null {
  const cookies = parseCookies(event.headers?.cookie || event.headers?.Cookie);
  const token = cookies[config.cookieName];
  if (!token) return null;
  const payload = verifyJwt(token, config.jwtSecret);
  if (!payload) return null;
  return {
    id: payload.sub,
    email: payload.email,
    full_name: (payload as any).full_name || '',
    role: (payload as any).role || 'user',
    is_admin: Boolean(payload.is_admin),
  };
}

async function handleLogin(event: HandlerEvent, config: TrainingConfig): Promise<HandlerResponse> {
  const originError = requireOrigin(event, config);
  if (originError) return originError;
  const start = Date.now();
  if (!config.demoKey || config.demoUsernames.length === 0) {
    return jsonResponse(503, {
      ok: false,
      code: 'CONFIG_INCOMPLETE',
      message: 'Training login is not configured',
      missing: [
        ...(config.demoKey ? [] : ['DEMO_KEY (or demo_key)']),
        ...(config.demoUsernames.length === 0 ? ['DEMO_USERNAME'] : []),
      ],
    });
  }
  const body = parseJsonBody<any>(event) || {};
  const usernameRaw =
    typeof body.username === 'string' ? body.username : typeof body.email === 'string' ? body.email : '';
  const passwordInput = typeof body.password === 'string' ? body.password : typeof body.key === 'string' ? body.key : '';
  const username = usernameRaw.trim();

  const ip = getClientIp(event) || 'unknown';
  const ipHash = hashIp(ip, config.jwtSecret);
  await enforceRateLimit(event, `login:${ipHash}`, 300, 10).catch((err: any) => {
    if (err?.statusCode === 429) {
      throw err;
    }
    throw err;
  });

  if (!username) {
    return failureResponse(start, 'INVALID_USERNAME', 'Username is incorrect');
  }

  const normalizedUsername = normalizeUsername(username);
  const usernameMatches = config.demoUsernames.some((allowed) =>
    safeCompare(normalizeUsername(allowed), normalizedUsername)
  );
  if (!usernameMatches) {
    return failureResponse(start, 'INVALID_USERNAME', 'Username is incorrect');
  }

  if (!passwordInput) {
    return failureResponse(start, 'INVALID_PASSWORD', 'Password is incorrect');
  }

  const passwordMatches = safeCompare(passwordInput, config.demoKey);
  if (!passwordMatches) {
    return failureResponse(start, 'INVALID_PASSWORD', 'Password is incorrect');
  }

  const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : '';
  const users = await readAll('users.csv', event);
  let user = users.find((u) => normalizeUsername(u.email) === normalizedUsername) as UserRow | undefined;
  const nowIso = new Date().toISOString();
  if (!user) {
    user = {
      id: crypto.randomUUID(),
      email: normalizedUsername,
      full_name: fullName,
      role: 'user',
      created_at: nowIso,
      last_login_at: nowIso,
    };
    await appendRow('users.csv', user, event);
  } else {
    await upsertBy(
      'users.csv',
      (row) => normalizeUsername(row.email) === normalizedUsername,
      (row) => ({ ...row!, last_login_at: nowIso, full_name: fullName || row!.full_name }) as UserRow,
      event
    );
    user = { ...user, last_login_at: nowIso, full_name: fullName || user.full_name };
  }

  await appendRow('logins.csv', {
    id: crypto.randomUUID(),
    user_id: user.id,
    ts: nowIso,
    ip_hash: ipHash,
    user_agent: event.headers?.['user-agent'] || event.headers?.['User-Agent'] || '',
  }, event);

  const isAdmin = config.adminEmails.includes(normalizedUsername);
  const token = signJwt(
    { sub: user.id, email: user.email, is_admin: isAdmin, role: user.role, full_name: user.full_name },
    config.jwtSecret,
    SESSION_TTL_SECONDS
  );
  const cookie = serializeCookie(config.cookieName, token, {
    httpOnly: true,
    secure: requestIsHttps(event),
    sameSite: 'Lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  });

  return jsonResponse(
    200,
    { ok: true, user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role, is_admin: isAdmin } },
    [cookie]
  );
}

async function handleLogout(event: HandlerEvent, config: TrainingConfig): Promise<HandlerResponse> {
  const originError = requireOrigin(event, config);
  if (originError) return originError;
  const expiredCookie = serializeCookie(config.cookieName, '', {
    httpOnly: true,
    secure: requestIsHttps(event),
    sameSite: 'Lax',
    path: '/',
    maxAge: 0,
  });
  return jsonResponse(200, { ok: true }, [expiredCookie]);
}

async function handleDemoLogin(event: HandlerEvent, config: TrainingConfig): Promise<HandlerResponse> {
  const originError = requireOrigin(event, config);
  if (originError) return originError;
  const demoEmail = 'demo@uplift-technologies.com';
  const demoFullName = 'Demo Learner';
  const normalizedDemo = normalizeUsername(demoEmail);
  const users = (await readAll('users.csv', event)) as UserRow[];
  const nowIso = new Date().toISOString();
  let user = users.find((u) => normalizeUsername(u.email) === normalizedDemo);
  if (!user) {
    user = {
      id: 'demo-user',
      email: demoEmail,
      full_name: demoFullName,
      role: 'user',
      created_at: nowIso,
      last_login_at: nowIso,
    };
    await appendRow('users.csv', user, event);
  } else {
    await upsertBy(
      'users.csv',
      (row) => normalizeUsername(row.email) === normalizedDemo,
      (row) => ({
        ...row!,
        last_login_at: nowIso,
        full_name: row?.full_name || demoFullName,
      }) as UserRow,
      event
    );
    user = { ...user, last_login_at: nowIso, full_name: user.full_name || demoFullName };
  }

  const token = signJwt(
    {
      sub: user.id,
      email: user.email,
      is_admin: false,
      role: user.role || 'user',
      full_name: user.full_name,
      demo: true,
    },
    config.jwtSecret,
    DEMO_SESSION_TTL_SECONDS
  );
  const cookie = serializeCookie(config.cookieName, token, {
    httpOnly: true,
    secure: requestIsHttps(event),
    sameSite: 'Lax',
    path: '/',
    maxAge: DEMO_SESSION_TTL_SECONDS,
  });

  return jsonResponse(
    200,
    { ok: true, user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role, is_admin: false } },
    [cookie]
  );
}

async function handleMe(event: HandlerEvent, config: TrainingConfig): Promise<HandlerResponse> {
  const auth = parseAuth(event, config);
  if (!auth) {
    return jsonResponse(401, { ok: false, error: 'unauthorized' });
  }
  return jsonResponse(200, { user: auth });
}

async function handleEvents(event: HandlerEvent, config: TrainingConfig): Promise<HandlerResponse> {
  const originError = requireOrigin(event, config);
  if (originError) return originError;
  const auth = parseAuth(event, config);
  if (!auth) return jsonResponse(401, { ok: false, error: 'unauthorized' });
  const ip = getClientIp(event) || 'unknown';
  const ipHash = hashIp(ip, config.jwtSecret);
  try {
    await enforceRateLimit(event, `events:${ipHash}`, 60, 120);
    await enforceRateLimit(event, `events-user:${auth.id}`, 60, 120);
  } catch (err: any) {
    if (err?.statusCode === 429) return jsonResponse(429, { ok: false, error: 'rate_limited' });
    throw err;
  }

  const body = parseJsonBody<any>(event) || {};
  const courseId = body.courseId || body.course_id;
  const moduleId = body.moduleId || body.module_id || body.stepId || '';
  const lessonId = body.lessonId || body.lesson_id || body.stepId || '';
  const eventType = body.eventType || body.type || 'event';
  const curriculumVersion = String(body.curriculumVersion || getCurriculumVersion() || '');
  const catalogVersion = String(body.catalogVersion || getCatalogVersion() || '');
  if (!courseId || !lessonId) {
    return errorResponse(400, 'invalid_event');
  }
  const tsValue = typeof body.ts === 'string' ? body.ts : new Date().toISOString();
  const tsDate = new Date(tsValue);
  const year = Number.isNaN(tsDate.getTime()) ? new Date().getUTCFullYear() : tsDate.getUTCFullYear();
  const meta = typeof body.meta === 'object' && body.meta !== null ? body.meta : {};

  await appendRow(
    `events-${year}.csv`,
    {
      id: crypto.randomUUID(),
      user_id: auth.id,
      course_id: String(courseId),
      module_id: String(moduleId ?? ''),
      lesson_id: String(lessonId ?? ''),
      event_type: String(eventType),
      ts: Number.isNaN(tsDate.getTime()) ? new Date().toISOString() : tsDate.toISOString(),
      meta_json: JSON.stringify(meta || {}),
      curriculum_version: curriculumVersion,
      catalog_version: catalogVersion,
    },
    event
  );

  if (eventType === 'heartbeat') {
    const deltaRaw = typeof meta?.secondsDelta === 'number' ? meta.secondsDelta : 15;
    const delta = Math.min(60, Math.max(1, deltaRaw));
    const nowIso = new Date().toISOString();
    await upsertBy(
      'lesson_time.csv',
      (row) =>
        row.user_id === auth.id &&
        row.course_id === String(courseId) &&
        row.module_id === String(moduleId ?? '') &&
        row.lesson_id === String(lessonId ?? '') &&
        row.curriculum_version === curriculumVersion,
      (row) => {
        const current = row ? parseInt((row as LessonTimeRow).seconds_active || '0', 10) : 0;
        return {
          user_id: auth.id,
          course_id: String(courseId),
          module_id: String(moduleId ?? ''),
          lesson_id: String(lessonId ?? ''),
          seconds_active: String(current + delta),
          updated_at: nowIso,
          curriculum_version: curriculumVersion,
          catalog_version: catalogVersion,
        } as LessonTimeRow;
      },
      event
    );
  }

  if (eventType === 'progress') {
    const completedAt = typeof body.completedAt === 'string' ? body.completedAt : tsDate.toISOString();
    const nowIso = new Date().toISOString();
    await upsertBy(
      'step_completions.csv',
      (row) =>
        row.user_id === auth.id &&
        row.course_id === String(courseId) &&
        row.step_id === String(lessonId ?? '') &&
        row.curriculum_version === curriculumVersion,
      (row) => ({
        user_id: auth.id,
        course_id: String(courseId),
        step_id: String(lessonId ?? ''),
        completed_at: row?.completed_at || completedAt,
        updated_at: nowIso,
        curriculum_version: curriculumVersion,
        catalog_version: catalogVersion,
      }),
      event
    );
  }

  return jsonResponse(200, { ok: true });
}

async function handleQuizSubmit(event: HandlerEvent, config: TrainingConfig): Promise<HandlerResponse> {
  const originError = requireOrigin(event, config);
  if (originError) return originError;
  const auth = parseAuth(event, config);
  if (!auth) return jsonResponse(401, { ok: false, error: 'unauthorized' });
  const ip = getClientIp(event) || 'unknown';
  const ipHash = hashIp(ip, config.jwtSecret);
  try {
    await enforceRateLimit(event, `quiz:${ipHash}`, 300, 20);
    await enforceRateLimit(event, `quiz-user:${auth.id}`, 300, 20);
  } catch (err: any) {
    if (err?.statusCode === 429) return jsonResponse(429, { ok: false, error: 'rate_limited' });
    throw err;
  }

  const body = parseJsonBody<any>(event) || {};
  const courseId = body.courseId || body.course_id;
  const quizId = body.quizId || body.quiz_id;
  const curriculumVersion = String(body.curriculumVersion || getCurriculumVersion() || '');
  const catalogVersion = String(body.catalogVersion || getCatalogVersion() || '');
  if (!courseId || !quizId) {
    return errorResponse(400, 'invalid_quiz_payload');
  }
  const startedAt = typeof body.startedAt === 'string' ? body.startedAt : new Date().toISOString();
  const answers = body.answers ?? {};

  const quizDefinition = getQuiz(String(courseId), String(quizId));
  if (!quizDefinition || !quizDefinition.questions?.length) {
    return errorResponse(400, 'quiz_not_configured');
  }

  const normalize = (value: unknown) => String(value ?? '').trim().toLowerCase();
  const scoreCandidates = quizDefinition.questions.map((q, idx) => {
    const expected = quizDefinition.answerKey[idx];
    const answer = (answers as any)[q.id ?? idx] ?? (answers as any)[idx] ?? (answers as any)[String(idx)] ?? '';
    if (Array.isArray(expected) && expected.length > 0) {
      return expected.some((opt) => normalize(opt) === normalize(answer));
    }
    if (typeof expected === 'string' && expected.trim().length > 0) {
      return normalize(expected) === normalize(answer);
    }
    return String(answer || '').trim().length > 0;
  });

  const correctCount = scoreCandidates.filter(Boolean).length;
  const scorePercent = quizDefinition.questions.length
    ? Math.round((correctCount / quizDefinition.questions.length) * 1000) / 10
    : 0;
  const threshold = quizDefinition.passingThresholdPercent ?? 80;
  const passed = scorePercent >= threshold;

  const attempts = await readAll('quiz_attempts.csv', event);
  const attemptsForQuiz = attempts.filter((a) => a.user_id === auth.id && a.quiz_id === String(quizId));
  const attemptNumber = attemptsForQuiz.reduce((max, row) => Math.max(max, parseInt(row.attempt_number || '0', 10)), 0) + 1;

  await appendRow(
    'quiz_attempts.csv',
    {
      id: crypto.randomUUID(),
      user_id: auth.id,
      course_id: String(courseId),
      quiz_id: String(quizId),
      attempt_number: String(attemptNumber),
      score_percent: String(scorePercent || 0),
      passed: passed ? 'true' : 'false',
      started_at: startedAt,
      submitted_at: new Date().toISOString(),
      answers_json: JSON.stringify(answers),
      curriculum_version: curriculumVersion,
      catalog_version: catalogVersion,
    },
    event
  );

  return jsonResponse(200, {
    ok: true,
    attemptNumber,
    scorePercent: scorePercent || 0,
    passed,
  });
}

async function handleProgress(event: HandlerEvent, config: TrainingConfig): Promise<HandlerResponse> {
  const auth = parseAuth(event, config);
  if (!auth) return jsonResponse(401, { error: 'unauthorized' });
  const progress = await buildProgress(auth.id, { persistCompletions: true, event });

  return jsonResponse(200, {
    curriculumVersion: getCurriculumVersion(),
    catalogVersion: getCatalogVersion(),
    courses: progress,
  });
}

function requireAdmin(event: HandlerEvent, config: TrainingConfig): { auth: AuthenticatedUser | null; error?: HandlerResponse } {
  const auth = parseAuth(event, config);
  if (!auth) {
    return { auth: null, error: jsonResponse(401, { ok: false, error: 'unauthorized' }) };
  }
  if (!auth.is_admin) {
    return { auth, error: jsonResponse(403, { ok: false, error: 'forbidden' }) };
  }
  return { auth };
}

async function handleAdminUsers(event: HandlerEvent, config: TrainingConfig): Promise<HandlerResponse> {
  const { error } = requireAdmin(event, config);
  if (error) return error;
  const q = (event.queryStringParameters?.q || '').toLowerCase();
  const users = (await readAll('users.csv', event)) as UserRow[];
  const filtered = users.filter((u) =>
    q ? u.email.toLowerCase().includes(q) || (u.full_name || '').toLowerCase().includes(q) : true
  );
  const mapped = filtered.map((u) => ({ id: u.id, email: u.email, full_name: u.full_name, last_login_at: u.last_login_at }));
  return jsonResponse(200, { ok: true, users: mapped });
}

async function handleAdminUserProgress(event: HandlerEvent, userId: string, config: TrainingConfig): Promise<HandlerResponse> {
  const { error } = requireAdmin(event, config);
  if (error) return error;
  const targetId = userId || '';
  if (!targetId) return errorResponse(400, 'invalid_user');
  const progress = await buildProgress(targetId, { persistCompletions: true, event });
  return jsonResponse(200, {
    curriculumVersion: getCurriculumVersion(),
    catalogVersion: getCatalogVersion(),
    courses: progress,
  });
}

async function handleAdminExport(event: HandlerEvent, config: TrainingConfig): Promise<HandlerResponse> {
  const { error } = requireAdmin(event, config);
  if (error) return error;
  const users = (await readAll('users.csv', event)) as UserRow[];
  const data = await loadTrainingData(event);
  const courses = listCatalogCourses();
  const headers = [
    'user_email',
    'user_full_name',
    'course_id',
    'course_name',
    'completion',
    'final_score',
    'total_time_seconds',
    'last_active',
    'certificate_code',
  ];

  const rows: string[] = [headers.join(',')];
  for (const user of users) {
    const progress = await buildProgress(user.id, { persistCompletions: false, data, event });
    for (const course of courses) {
      const summary = progress.find((p) => p.courseId === course.id) as CourseProgressSummary | undefined;
      const completion = summary?.completed ? summary.completedAt || '' : '';
      const totalTime = summary?.totalTimeSeconds ?? 0;
      const finalScore = summary?.finalScore ?? '';
      const lastActiveCandidates = [
        ...data.lessons
          .filter((l) => l.user_id === user.id && l.course_id === course.id)
          .map((l) => l.updated_at)
          .filter(Boolean),
        ...data.quizzes
          .filter((q) => q.user_id === user.id && q.course_id === course.id)
          .map((q) => q.submitted_at)
          .filter(Boolean),
      ]
        .filter(Boolean)
        .sort();
      const lastActive = lastActiveCandidates[lastActiveCandidates.length - 1] || '';
      const certificateCode = summary?.certificateCode || '';
      rows.push([
        user.email,
        user.full_name,
        course.id,
        course.title,
        completion,
        String(finalScore ?? ''),
        String(totalTime ?? 0),
        lastActive,
        certificateCode,
      ]
        .map((value) => {
          const needsQuote = /[",\n\r]/.test(value || '');
          const escaped = String(value || '').replace(/"/g, '""');
          return needsQuote ? `"${escaped}"` : escaped;
        })
        .join(','));
    }
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Cache-Control': 'no-store',
    },
    body: rows.join('\n'),
  };
}

async function handleCertificateIssue(event: HandlerEvent, config: TrainingConfig): Promise<HandlerResponse> {
  const originError = requireOrigin(event, config);
  if (originError) return originError;
  const auth = parseAuth(event, config);
  if (!auth) return jsonResponse(401, { ok: false, error: 'unauthorized' });
  const body = parseJsonBody<any>(event) || {};
  const courseId = String(body.courseId || '');
  if (!courseId) return errorResponse(400, 'invalid_request');

  const courseProgress = await getCourseProgress(auth.id, courseId, { persistCompletions: true, event });
  if (!courseProgress || !courseProgress.completed) {
    return errorResponse(403, 'course_incomplete');
  }

  const certificates = (await readAll('certificates.csv', event)) as CertificateRow[];
  const existing = certificates.find(
    (c) =>
      c.user_id === auth.id &&
      c.course_id === courseId &&
      c.curriculum_version === getCurriculumVersion()
  );
  if (existing) {
    return jsonResponse(200, { ok: true, certificateCode: existing.certificate_code });
  }

  const certificateId = crypto.randomUUID();
  const certificateCode = crypto.randomBytes(16).toString('hex');
  const issuedAt = new Date().toISOString();

  await appendRow(
    'certificates.csv',
    {
      id: certificateId,
      certificate_code: certificateCode,
      user_id: auth.id,
      course_id: courseId,
      issued_at: issuedAt,
      curriculum_version: getCurriculumVersion(),
      catalog_version: getCatalogVersion(),
    },
    event
  );

  await upsertBy(
    'completions.csv',
    (row) =>
      row.user_id === auth.id &&
      row.course_id === courseId &&
      row.curriculum_version === getCurriculumVersion(),
    (row) => ({
      ...(row as CompletionRow | null),
      id: row?.id || crypto.randomUUID(),
      user_id: auth.id,
      course_id: courseId,
      completed_at: row?.completed_at || courseProgress.completedAt || issuedAt,
      final_score: row?.final_score || (courseProgress.finalScore !== null ? String(courseProgress.finalScore) : ''),
      certificate_id: certificateId,
      curriculum_version: getCurriculumVersion(),
      catalog_version: getCatalogVersion(),
    }) as CompletionRow,
    event
  );

  return jsonResponse(200, { ok: true, certificateCode });
}

async function handleCertificatePdf(event: HandlerEvent, config: TrainingConfig): Promise<HandlerResponse> {
  const auth = parseAuth(event, config);
  if (!auth) return jsonResponse(401, { ok: false, error: 'unauthorized' });
  const courseId = event.queryStringParameters?.courseId;
  if (!courseId) return errorResponse(400, 'invalid_request');
  const [certificates, completions] = await Promise.all([
    readAll('certificates.csv', event) as Promise<CertificateRow[]>,
    readAll('completions.csv', event) as Promise<CompletionRow[]>,
  ]);
  const currentVersion = getCurriculumVersion();
  const certificate =
    certificates.find(
      (c) => c.user_id === auth.id && c.course_id === courseId && c.curriculum_version === currentVersion
    ) || certificates.find((c) => c.user_id === auth.id && c.course_id === courseId);
  if (!certificate) return jsonResponse(403, { ok: false, error: 'forbidden' });
  const completion =
    completions.find(
      (c) => c.user_id === auth.id && c.course_id === courseId && c.curriculum_version === currentVersion
    ) || completions.find((c) => c.user_id === auth.id && c.course_id === courseId);
  const courseName = courseTitle(courseId);

  const doc = await PDFDocument.create();
  const page = doc.addPage([612, 792]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const drawLine = (text: string, y: number, size = 16) => {
    page.drawText(text, { x: 72, y, size, font, color: rgb(0.1, 0.1, 0.1) });
  };
  const issuedAt = completion?.completed_at || certificate.issued_at;
  drawLine('Certificate of Completion', 700, 24);
  drawLine('Uplift Technologies', 660, 18);
  drawLine(`Awarded to: ${auth.full_name || auth.email}`, 620);
  drawLine(`Course: ${courseName}`, 590);
  drawLine(`Completed on: ${issuedAt}`, 560);
  drawLine(`Certificate code: ${certificate.certificate_code}`, 530);
  drawLine(`Verify at /training/verify?code=${certificate.certificate_code}`, 500, 12);

  const pdfBytes = await doc.save();
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Cache-Control': 'no-store',
      'Content-Disposition': 'inline; filename="Uplift-Technologies-Certificate.pdf"',
    },
    body: Buffer.from(pdfBytes).toString('base64'),
    isBase64Encoded: true,
  };
}

async function handleCertificateVerify(event: HandlerEvent): Promise<HandlerResponse> {
  const code = event.queryStringParameters?.code;
  if (!code) return errorResponse(400, 'invalid_request');
  const [certificates, users] = await Promise.all([
    readAll('certificates.csv', event) as Promise<CertificateRow[]>,
    readAll('users.csv', event) as Promise<UserRow[]>,
  ]);
  const certificate = certificates.find((c) => c.certificate_code === code);
  if (!certificate) {
    return jsonResponse(200, { valid: false });
  }
  const user = users.find((u) => u.id === certificate.user_id);
  return jsonResponse(200, {
    valid: true,
    full_name: user?.full_name,
    course_name: courseTitle(certificate.course_id),
    issued_at: certificate.issued_at,
  });
}

const handler: Handler = async (event) => {
  try {
    let path = event.path || '';
    path = path.replace(/^\/?\.netlify\/functions\/training-api/, '') || path;
    const method = event.httpMethod || 'GET';

    if (path === '/api/training/certificates/verify') {
      if (method !== 'GET') return methodNotAllowed();
      return await handleCertificateVerify(event);
    }

    let config: TrainingConfig;
    try {
      config = loadConfig();
    } catch (err: any) {
      if (err?.message === 'CONFIG_INCOMPLETE') {
        if (path === '/api/training/auth/me') {
          return jsonResponse(401, { ok: false, error: 'unauthorized' });
        }
        return jsonResponse(err?.statusCode || 503, {
          ok: false,
          code: 'CONFIG_INCOMPLETE',
          message: 'Training configuration missing',
          missing: Array.isArray(err?.missing) ? err.missing : undefined,
        });
      }
      throw err;
    }
    if (path === '/api/training/auth/login') {
      if (method !== 'POST') return methodNotAllowed();
      return await handleLogin(event, config);
    }

    if (path === '/api/training/auth/logout') {
      if (method !== 'POST') return methodNotAllowed();
      return await handleLogout(event, config);
    }

    if (path === '/api/training/auth/me') {
      if (method !== 'GET') return methodNotAllowed();
      return await handleMe(event, config);
    }

    if (path === '/api/training/demo-login') {
      if (method !== 'POST') return methodNotAllowed();
      return await handleDemoLogin(event, config);
    }

    if (path === '/api/training/events') {
      if (method !== 'POST') return methodNotAllowed();
      return await handleEvents(event, config);
    }

    if (path === '/api/training/quizzes/submit') {
      if (method !== 'POST') return methodNotAllowed();
      return await handleQuizSubmit(event, config);
    }

    if (path === '/api/training/progress') {
      if (method !== 'GET') return methodNotAllowed();
      return await handleProgress(event, config);
    }

    if (path === '/api/training/admin/users') {
      if (method !== 'GET') return methodNotAllowed();
      return await handleAdminUsers(event, config);
    }

    if (path.startsWith('/api/training/admin/user/')) {
      if (method !== 'GET') return methodNotAllowed();
      const userId = path.replace('/api/training/admin/user/', '').replace('/progress', '').replace(/\/$/, '');
      return await handleAdminUserProgress(event, userId, config);
    }

    if (path === '/api/training/admin/export.csv') {
      if (method !== 'GET') return methodNotAllowed();
      return await handleAdminExport(event, config);
    }

    if (path === '/api/training/certificates/issue') {
      if (method !== 'POST') return methodNotAllowed();
      return await handleCertificateIssue(event, config);
    }

    if (path === '/api/training/certificates/pdf') {
      if (method !== 'GET') return methodNotAllowed();
      return await handleCertificatePdf(event, config);
    }

    return notFound();
  } catch (err: any) {
    if (err?.statusCode === 429) {
      return jsonResponse(429, { ok: false, error: 'rate_limited' });
    }
    return serverError();
  }
};

export { handler };

export const config: Config = {
  path: '/api/training/*',
  preferStatic: true,
};
