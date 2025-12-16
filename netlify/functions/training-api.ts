import crypto from 'crypto';
import type { Handler, HandlerEvent, HandlerResponse, Config } from '@netlify/functions';
import { badRequest, jsonResponse, methodNotAllowed, notFound, parseJsonBody, serverError } from './_lib/http';
import { getAdminEmails, getEnv } from './_lib/env';
import { appendRow, readAll, upsertBy } from './_lib/csvStore';
import {
  AuthenticatedUser,
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
  safeCompare,
  serializeCookie,
  signJwt,
  verifyJwt,
  verifyOrigin,
} from './_lib/security';

const jwtSecret = getEnv('TRAINING_JWT_SECRET', true) as string;
const demoKey = (getEnv('demo_key') || getEnv('DEMO_KEY')) as string | undefined;
const cookieName = getEnv('TRAINING_COOKIE_NAME', false, 'training_session') as string;
const trainingOrigin = getEnv('TRAINING_APP_ORIGIN', true) as string;
const adminEmails = getAdminEmails();
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

function emailValid(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function failureResponse(start: number): Promise<HandlerResponse> {
  const elapsed = Date.now() - start;
  const wait = Math.max(0, 350 - elapsed);
  return new Promise((resolve) =>
    setTimeout(() => resolve(jsonResponse(401, { error: 'Invalid credentials' })), wait)
  );
}

async function enforceRateLimit(key: string, windowSeconds: number, maxCount: number): Promise<void> {
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
    }
  );
}

function requireOrigin(event: HandlerEvent): HandlerResponse | null {
  if (!verifyOrigin(event, trainingOrigin)) {
    return jsonResponse(403, { error: 'forbidden' });
  }
  return null;
}

function parseAuth(event: HandlerEvent): AuthenticatedUser | null {
  const cookies = parseCookies(event.headers?.cookie || event.headers?.Cookie);
  const token = cookies[cookieName];
  if (!token) return null;
  const payload = verifyJwt(token, jwtSecret);
  if (!payload) return null;
  return {
    id: payload.sub,
    email: payload.email,
    full_name: (payload as any).full_name || '',
    role: (payload as any).role || 'user',
    is_admin: Boolean(payload.is_admin),
  };
}

async function handleLogin(event: HandlerEvent): Promise<HandlerResponse> {
  const originError = requireOrigin(event);
  if (originError) return originError;
  const start = Date.now();
  const body = parseJsonBody<any>(event) || {};
  const emailRaw = typeof body.email === 'string' ? body.email : '';
  const passwordInput = typeof body.password === 'string' ? body.password : typeof body.key === 'string' ? body.key : '';
  if (!demoKey) {
    return jsonResponse(500, { error: 'server_error' });
  }
  if (!emailRaw || !passwordInput || !emailValid(emailRaw)) {
    return failureResponse(start);
  }
  const passwordMatches = safeCompare(passwordInput, demoKey);
  const ip = getClientIp(event) || 'unknown';
  const ipHash = hashIp(ip, jwtSecret);
  await enforceRateLimit(`login:${ipHash}`, 300, 10).catch((err: any) => {
    if (err?.statusCode === 429) {
      throw err;
    }
    throw err;
  });
  if (!passwordMatches) {
    return failureResponse(start);
  }

  const email = normalizeEmail(emailRaw);
  const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : '';
  const users = await readAll('users.csv');
  let user = users.find((u) => normalizeEmail(u.email) === email) as UserRow | undefined;
  const nowIso = new Date().toISOString();
  if (!user) {
    user = {
      id: crypto.randomUUID(),
      email,
      full_name: fullName,
      role: 'user',
      created_at: nowIso,
      last_login_at: nowIso,
    };
    await appendRow('users.csv', user);
  } else {
    await upsertBy(
      'users.csv',
      (row) => normalizeEmail(row.email) === email,
      (row) => ({ ...row!, last_login_at: nowIso, full_name: fullName || row!.full_name }) as UserRow
    );
    user = { ...user, last_login_at: nowIso, full_name: fullName || user.full_name };
  }

  await appendRow('logins.csv', {
    id: crypto.randomUUID(),
    user_id: user.id,
    ts: nowIso,
    ip_hash: ipHash,
    user_agent: event.headers?.['user-agent'] || event.headers?.['User-Agent'] || '',
  });

  const isAdmin = adminEmails.includes(email);
  const token = signJwt(
    { sub: user.id, email: user.email, is_admin: isAdmin, role: user.role, full_name: user.full_name },
    jwtSecret,
    SESSION_TTL_SECONDS
  );
  const cookie = serializeCookie(cookieName, token, {
    httpOnly: true,
    secure: true,
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

async function handleLogout(event: HandlerEvent): Promise<HandlerResponse> {
  const originError = requireOrigin(event);
  if (originError) return originError;
  const expiredCookie = serializeCookie(cookieName, '', {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    path: '/',
    maxAge: 0,
  });
  return jsonResponse(200, { ok: true }, [expiredCookie]);
}

async function handleMe(event: HandlerEvent): Promise<HandlerResponse> {
  const auth = parseAuth(event);
  if (!auth) {
    return jsonResponse(401, { error: 'unauthorized' });
  }
  return jsonResponse(200, { user: auth });
}

async function handleEvents(event: HandlerEvent): Promise<HandlerResponse> {
  const originError = requireOrigin(event);
  if (originError) return originError;
  const auth = parseAuth(event);
  if (!auth) return jsonResponse(401, { error: 'unauthorized' });
  const ip = getClientIp(event) || 'unknown';
  const ipHash = hashIp(ip, jwtSecret);
  try {
    await enforceRateLimit(`events:${ipHash}`, 60, 120);
    await enforceRateLimit(`events-user:${auth.id}`, 60, 120);
  } catch (err: any) {
    if (err?.statusCode === 429) return jsonResponse(429, { error: 'rate_limited' });
    throw err;
  }

  const body = parseJsonBody<any>(event) || {};
  const courseId = body.courseId || body.course_id;
  const moduleId = body.moduleId || body.module_id || body.stepId || '';
  const lessonId = body.lessonId || body.lesson_id || body.stepId || '';
  const eventType = body.eventType || body.type || 'event';
  if (!courseId || !lessonId) {
    return badRequest('invalid_event');
  }
  const tsValue = typeof body.ts === 'string' ? body.ts : new Date().toISOString();
  const tsDate = new Date(tsValue);
  const year = Number.isNaN(tsDate.getTime()) ? new Date().getUTCFullYear() : tsDate.getUTCFullYear();
  const meta = typeof body.meta === 'object' && body.meta !== null ? body.meta : {};

  await appendRow(`events-${year}.csv`, {
    id: crypto.randomUUID(),
    user_id: auth.id,
    course_id: String(courseId),
    module_id: String(moduleId ?? ''),
    lesson_id: String(lessonId ?? ''),
    event_type: String(eventType),
    ts: Number.isNaN(tsDate.getTime()) ? new Date().toISOString() : tsDate.toISOString(),
    meta_json: JSON.stringify(meta || {}),
  });

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
        row.lesson_id === String(lessonId ?? ''),
      (row) => {
        const current = row ? parseInt((row as LessonTimeRow).seconds_active || '0', 10) : 0;
        return {
          user_id: auth.id,
          course_id: String(courseId),
          module_id: String(moduleId ?? ''),
          lesson_id: String(lessonId ?? ''),
          seconds_active: String(current + delta),
          updated_at: nowIso,
        } as LessonTimeRow;
      }
    );
  }

  return jsonResponse(200, { ok: true });
}

async function handleQuizSubmit(event: HandlerEvent): Promise<HandlerResponse> {
  const originError = requireOrigin(event);
  if (originError) return originError;
  const auth = parseAuth(event);
  if (!auth) return jsonResponse(401, { error: 'unauthorized' });
  const ip = getClientIp(event) || 'unknown';
  const ipHash = hashIp(ip, jwtSecret);
  try {
    await enforceRateLimit(`quiz:${ipHash}`, 300, 20);
    await enforceRateLimit(`quiz-user:${auth.id}`, 300, 20);
  } catch (err: any) {
    if (err?.statusCode === 429) return jsonResponse(429, { error: 'rate_limited' });
    throw err;
  }

  const body = parseJsonBody<any>(event) || {};
  const courseId = body.courseId || body.course_id;
  const quizId = body.quizId || body.quiz_id;
  if (!courseId || !quizId) {
    return badRequest('invalid_quiz_payload');
  }
  const startedAt = typeof body.startedAt === 'string' ? body.startedAt : new Date().toISOString();
  const answers = body.answers ?? {};
  const scorePercent = typeof body.scorePercent === 'number' ? body.scorePercent : 0;
  const passed = typeof body.passed === 'boolean' ? body.passed : scorePercent > 0 ? scorePercent >= 70 : false;

  const attempts = await readAll('quiz_attempts.csv');
  const attemptsForQuiz = attempts.filter((a) => a.user_id === auth.id && a.quiz_id === String(quizId));
  const attemptNumber = attemptsForQuiz.reduce((max, row) => Math.max(max, parseInt(row.attempt_number || '0', 10)), 0) + 1;

  await appendRow('quiz_attempts.csv', {
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
  });

  return jsonResponse(200, {
    ok: true,
    attemptNumber,
    scorePercent: scorePercent || 0,
    passed,
  });
}

async function handleProgress(event: HandlerEvent): Promise<HandlerResponse> {
  const auth = parseAuth(event);
  if (!auth) return jsonResponse(401, { error: 'unauthorized' });
  const lessonRows = (await readAll('lesson_time.csv')) as LessonTimeRow[];
  const lessons = lessonRows.filter((row) => row.user_id === auth.id);
  const quizRows = (await readAll('quiz_attempts.csv')) as QuizAttemptRow[];
  const quizzes = quizRows.filter((row) => row.user_id === auth.id);
  const completionRows = (await readAll('completions.csv')) as CompletionRow[];
  const completions = completionRows.filter((row) => row.user_id === auth.id);

  const courses = new Map<
    string,
    {
      courseId: string;
      totalTimeSeconds: number;
      lessons: {
        moduleId: string;
        lessonId: string;
        secondsActive: number;
        lastActive: string;
      }[];
      quizzes: {
        quizId: string;
        attemptNumber: number;
        scorePercent: number;
        passed: boolean;
        submittedAt: string;
      }[];
      completion?: {
        completedAt: string;
        finalScore: string;
        certificateId: string;
      };
    }
  >();

  for (const lesson of lessons) {
    const courseEntry = courses.get(lesson.course_id) || {
      courseId: lesson.course_id,
      totalTimeSeconds: 0,
      lessons: [],
      quizzes: [],
    };
    const seconds = parseInt(lesson.seconds_active || '0', 10);
    courseEntry.totalTimeSeconds += seconds;
    courseEntry.lessons.push({
      moduleId: lesson.module_id,
      lessonId: lesson.lesson_id,
      secondsActive: seconds,
      lastActive: lesson.updated_at,
    });
    courses.set(lesson.course_id, courseEntry);
  }

  for (const quiz of quizzes) {
    const courseEntry = courses.get(quiz.course_id) || {
      courseId: quiz.course_id,
      totalTimeSeconds: 0,
      lessons: [],
      quizzes: [],
    };
    courseEntry.quizzes.push({
      quizId: quiz.quiz_id,
      attemptNumber: parseInt(quiz.attempt_number || '0', 10),
      scorePercent: parseFloat(quiz.score_percent || '0'),
      passed: quiz.passed === 'true',
      submittedAt: quiz.submitted_at,
    });
    courses.set(quiz.course_id, courseEntry);
  }

  for (const completion of completions) {
    const courseEntry = courses.get(completion.course_id) || {
      courseId: completion.course_id,
      totalTimeSeconds: 0,
      lessons: [],
      quizzes: [],
    };
    courseEntry.completion = {
      completedAt: completion.completed_at,
      finalScore: completion.final_score,
      certificateId: completion.certificate_id,
    };
    courses.set(completion.course_id, courseEntry);
  }

  const response = Array.from(courses.values()).map((course) => ({
    ...course,
    steps: course.lessons.map((l) => ({
      stepId: `${l.moduleId}:${l.lessonId}`,
      completed: l.secondsActive > 0,
      completedAt: l.lastActive,
    })),
  }));

  return jsonResponse(200, response);
}

const handler: Handler = async (event) => {
  try {
    const path = event.path || '';
    const method = event.httpMethod || 'GET';

    if (path.startsWith('/api/training/admin') || path.startsWith('/api/training/certificates')) {
      return notFound();
    }

    if (path === '/api/training/auth/login') {
      if (method !== 'POST') return methodNotAllowed();
      return await handleLogin(event);
    }

    if (path === '/api/training/auth/logout') {
      if (method !== 'POST') return methodNotAllowed();
      return await handleLogout(event);
    }

    if (path === '/api/training/auth/me') {
      if (method !== 'GET') return methodNotAllowed();
      return await handleMe(event);
    }

    if (path === '/api/training/events') {
      if (method !== 'POST') return methodNotAllowed();
      return await handleEvents(event);
    }

    if (path === '/api/training/quizzes/submit') {
      if (method !== 'POST') return methodNotAllowed();
      return await handleQuizSubmit(event);
    }

    if (path === '/api/training/progress') {
      if (method !== 'GET') return methodNotAllowed();
      return await handleProgress(event);
    }

    return notFound();
  } catch (err: any) {
    if (err?.statusCode === 429) {
      return jsonResponse(429, { error: 'rate_limited' });
    }
    return serverError();
  }
};

export { handler };

export const config: Config = {
  path: '/api/training/*',
  preferStatic: true,
};
