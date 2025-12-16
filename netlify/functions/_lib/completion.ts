import crypto from 'crypto';
import { CompletionRow, LessonTimeRow, QuizAttemptRow, CertificateRow } from './types';
import { appendRow, readAll, upsertBy } from './csvStore';
import { CatalogStep, getCourse, listCatalogCourses } from './catalog';

export interface LessonProgress {
  lessonId: string;
  title?: string;
  type?: string;
  dayNumber?: number;
  secondsActive: number;
  completed: boolean;
  completedAt?: string;
  completionReason?: 'time' | 'quiz';
  hasQuiz: boolean;
  quizId?: string;
  quizPassed: boolean;
  locked: boolean;
  lockedReason?: string;
}

export interface QuizProgress {
  quizId: string;
  latestScorePercent: number;
  passed: boolean;
  attempts: number;
}

export interface CourseProgressSummary {
  courseId: string;
  courseName: string;
  totalTimeSeconds: number;
  lessons: LessonProgress[];
  quizzes: QuizProgress[];
  completed: boolean;
  completedAt?: string;
  finalScore: number | null;
  certificateId?: string;
  certificateCode?: string;
  certificateIssuedAt?: string;
  steps: { stepId: string; completed: boolean; completedAt?: string }[];
}

export interface TrainingData {
  lessons: LessonTimeRow[];
  quizzes: QuizAttemptRow[];
  completions: CompletionRow[];
  certificates: CertificateRow[];
}

function sumSeconds(rows: LessonTimeRow[], courseId: string, lessonId: string): { seconds: number; lastActive?: string } {
  const matching = rows.filter((row) => row.course_id === courseId && row.lesson_id === lessonId);
  const seconds = matching.reduce((acc, row) => acc + parseInt(row.seconds_active || '0', 10), 0);
  const lastActive = matching
    .map((row) => row.updated_at)
    .filter(Boolean)
    .sort()
    .pop();
  return { seconds, lastActive };
}

function latestQuizAttempt(attempts: QuizAttemptRow[], courseId: string, quizId: string): QuizAttemptRow | null {
  const matches = attempts.filter((a) => a.course_id === courseId && a.quiz_id === quizId);
  if (!matches.length) return null;
  return matches.reduce((latest, current) => {
    const currentAttempt = parseInt(current.attempt_number || '0', 10);
    const latestAttempt = parseInt(latest.attempt_number || '0', 10);
    if (currentAttempt === latestAttempt) {
      return (current.submitted_at || '') > (latest.submitted_at || '') ? current : latest;
    }
    return currentAttempt > latestAttempt ? current : latest;
  });
}

function lessonComplete(step: CatalogStep, timeSeconds: number, quizAttempt: QuizAttemptRow | null): LessonProgress {
  const hasQuiz = Boolean(step?.assessment?.questions?.length);
  const quizPassed = quizAttempt ? quizAttempt.passed === 'true' : false;
  const timeComplete = timeSeconds >= 180;
  const completed = hasQuiz ? quizPassed || timeComplete : timeComplete;
  const completionReason: 'time' | 'quiz' | undefined = completed
    ? quizPassed
      ? 'quiz'
      : 'time'
    : undefined;
  const completedAt = completionReason === 'quiz' ? quizAttempt?.submitted_at : undefined;
  const lockedReason = completed
    ? undefined
    : hasQuiz && !quizPassed && !timeComplete
      ? 'requires_quiz_or_time'
      : 'requires_time';

  return {
    lessonId: step.stepId,
    title: step.title,
    type: step.type,
    dayNumber: (step as any).dayNumber,
    secondsActive: timeSeconds,
    completed,
    completedAt,
    completionReason,
    hasQuiz,
    quizId: step.assessment?.quizId || step.stepId,
    quizPassed,
    locked: !completed,
    lockedReason,
  };
}

function computeFinalScore(courseId: string, courseQuizzes: { quizId: string }[], attempts: QuizAttemptRow[]): number | null {
  const scores: number[] = [];
  for (const quiz of courseQuizzes) {
    const latest = latestQuizAttempt(attempts, courseId, quiz.quizId);
    if (!latest) continue;
    const score = parseFloat(latest.score_percent || '0');
    if (Number.isFinite(score)) {
      scores.push(score);
    }
  }
  if (!scores.length) return null;
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  return Math.round(avg * 100) / 100;
}

async function persistCompletion(
  userId: string,
  courseId: string,
  completedAt: string,
  finalScore: number | null,
  existing: CompletionRow | undefined
) {
  const finalScoreValue = finalScore === null || Number.isNaN(finalScore) ? '' : String(finalScore);
  if (existing) {
    if (existing.final_score !== finalScoreValue || !existing.completed_at) {
      await upsertBy(
        'completions.csv',
        (row) => row.user_id === userId && row.course_id === courseId,
        (row) => ({
          ...(row || existing),
          completed_at: row?.completed_at || existing.completed_at || completedAt,
          final_score: finalScoreValue,
          certificate_id: row?.certificate_id || existing.certificate_id || '',
          id: row?.id || existing.id,
          user_id: userId,
          course_id: courseId,
        })
      );
    }
    return;
  }
  await appendRow('completions.csv', {
    id: crypto.randomUUID(),
    user_id: userId,
    course_id: courseId,
    completed_at: completedAt,
    final_score: finalScoreValue,
    certificate_id: '',
  });
}

export async function loadTrainingData(): Promise<TrainingData> {
  const [lessons, quizzes, completions, certificates] = await Promise.all([
    readAll('lesson_time.csv') as Promise<LessonTimeRow[]>,
    readAll('quiz_attempts.csv') as Promise<QuizAttemptRow[]>,
    readAll('completions.csv') as Promise<CompletionRow[]>,
    readAll('certificates.csv') as Promise<CertificateRow[]>,
  ]);
  return { lessons, quizzes, completions, certificates };
}

function withDayNumber(step: CatalogStep, dayNumber?: number): CatalogStep {
  return { ...step, dayNumber };
}

export async function buildProgress(
  userId: string,
  options: { persistCompletions?: boolean; data?: TrainingData } = {}
): Promise<CourseProgressSummary[]> {
  const { persistCompletions = true, data: providedData } = options;
  const data = providedData || (await loadTrainingData());
  const courses: CourseProgressSummary[] = [];
  const catalogCourses = listCatalogCourses();

  for (const course of catalogCourses) {
    const courseLessons = data.lessons.filter((row) => row.user_id === userId && row.course_id === course.id);
    const courseQuizAttempts = data.quizzes.filter((row) => row.user_id === userId && row.course_id === course.id);
    const completionRow = data.completions.find((row) => row.user_id === userId && row.course_id === course.id);
    const certificateRow = data.certificates.find(
      (row) => row.user_id === userId && row.course_id === course.id
    );

    const steps: CatalogStep[] = [];
    const quizzesInCourse: { quizId: string }[] = [];
    for (const day of course.days || []) {
      for (const step of day.steps || []) {
        const enriched = withDayNumber(step as CatalogStep, day.dayNumber);
        steps.push(enriched);
        if (step.assessment?.questions?.length) {
          quizzesInCourse.push({ quizId: step.assessment.quizId || step.stepId });
        }
      }
    }

    const lessons: LessonProgress[] = [];
    for (const step of steps) {
      const { seconds, lastActive } = sumSeconds(courseLessons, course.id, step.stepId);
      const quizAttempt = latestQuizAttempt(courseQuizAttempts, course.id, step.assessment?.quizId || step.stepId);
      const progress = lessonComplete(step, seconds, quizAttempt);
      progress.completedAt = progress.completedAt || lastActive;
      lessons.push(progress);
    }

    const totalTimeSeconds = courseLessons.reduce((acc, row) => acc + parseInt(row.seconds_active || '0', 10), 0);
    const quizzes: QuizProgress[] = quizzesInCourse.map((q) => {
      const latest = latestQuizAttempt(courseQuizAttempts, course.id, q.quizId);
      return {
        quizId: q.quizId,
        latestScorePercent: latest ? parseFloat(latest.score_percent || '0') : 0,
        passed: latest ? latest.passed === 'true' : false,
        attempts: latest ? parseInt(latest.attempt_number || '0', 10) : 0,
      };
    });

    const completed = lessons.length > 0 && lessons.every((l) => l.completed);
    const courseFinalScore = computeFinalScore(course.id, quizzesInCourse, courseQuizAttempts);
    const completedAt = completed
      ? completionRow?.completed_at ||
        lessons
          .map((l) => l.completedAt)
          .filter(Boolean)
          .sort()
          .pop() ||
        new Date().toISOString()
      : undefined;

    if (completed && persistCompletions) {
      await persistCompletion(userId, course.id, completedAt as string, courseFinalScore, completionRow);
    }

    const certificateId = completionRow?.certificate_id || certificateRow?.id || '';
    const certificate = certificateRow || data.certificates.find((row) => row.id === completionRow?.certificate_id);

    courses.push({
      courseId: course.id,
      courseName: course.title,
      totalTimeSeconds,
      lessons,
      quizzes,
      completed,
      completedAt,
      finalScore: courseFinalScore,
      certificateId: certificateId || undefined,
      certificateCode: certificate?.certificate_code,
      certificateIssuedAt: certificate?.issued_at,
      steps: lessons.map((l) => ({ stepId: l.lessonId, completed: l.completed, completedAt: l.completedAt })),
    });
  }

  return courses;
}

export async function getCourseProgress(
  userId: string,
  courseId: string,
  options: { persistCompletions?: boolean } = {}
): Promise<CourseProgressSummary | null> {
  const course = getCourse(courseId);
  if (!course) return null;
  const progress = await buildProgress(userId, options);
  return progress.find((c) => c.courseId === courseId) || null;
}
