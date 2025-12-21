import type { HandlerEvent, CompletionRow, LessonTimeRow, QuizAttemptRow, CertificateRow } from './types';
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
  existing: CompletionRow | undefined,
  event?: HandlerEvent
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
        }),
        event
      );
    }
    return;
  }
  await appendRow(
    'completions.csv',
    {
      id: crypto.randomUUID(),
      user_id: userId,
      course_id: courseId,
      completed_at: completedAt,
      final_score: finalScoreValue,
      certificate_id: '',
    },
    event
  );
}

export async function loadTrainingData(event?: HandlerEvent): Promise<TrainingData> {
  const [lessons, quizzes, completions, certificates] = await Promise.all([
    readAll('lesson_time.csv', event) as Promise<LessonTimeRow[]>,
    readAll('quiz_attempts.csv', event) as Promise<QuizAttemptRow[]>,
    readAll('completions.csv', event) as Promise<CompletionRow[]>,
    readAll('certificates.csv', event) as Promise<CertificateRow[]>,
  ]);
  return { lessons, quizzes, completions, certificates };
}

function withDayNumber(step: CatalogStep, dayNumber?: number): CatalogStep {
  return { ...step, dayNumber };
}

export async function buildProgress(
  userId: string,
  options: { persistCompletions?: boolean; data?: TrainingData; event?: HandlerEvent } = {}
): Promise<CourseProgressSummary[]> {
  const { persistCompletions = true, data: providedData, event } = options;
  const data = providedData || (await loadTrainingData(event));
  const courses: CourseProgressSummary[] = [];
  const catalogCourses = listCatalogCourses();

  for (const course of catalogCourses) {
    const courseLessons = data.lessons.filter((row) => row.user_id === userId && row.course_id === course.id);
    const courseQuizAttempts = data.quizzes.filter((row) => row.user_id === userId && row.course_id === course.id);
    const completionRow = data.completions.find((row) => row.user_id === userId && row.course_id === course.id);
    const certificateRow = data.certificates.find((row) => row.user_id === userId && row.course_id === course.id);

    const steps: CatalogStep[] = [];
    const quizzesInCourse: { quizId: string }[] = [];
    for (const day of course.days || []) {
      const dayNumber = day.dayNumber;
      for (const step of day.steps || []) {
        const normalized = withDayNumber(step, dayNumber);
        steps.push(normalized);
        if (step.assessment?.questions?.length) {
          quizzesInCourse.push({ quizId: step.assessment.quizId || step.stepId });
        }
      }
    }

    const lessons: LessonProgress[] = steps.map((step) => {
      const entry = courseLessons.find((row) => row.lesson_id === step.stepId);
      const seconds = entry ? parseInt(entry.seconds_active || '0', 10) : 0;
      const quizAttempt = step.assessment?.questions?.length
        ? latestQuizAttempt(courseQuizAttempts, course.id, step.assessment.quizId || step.stepId)
        : null;
      return lessonComplete(step, seconds, quizAttempt);
    });

    const quizzes: QuizProgress[] = quizzesInCourse.map((quiz) => {
      const attempts = courseQuizAttempts.filter((row) => row.quiz_id === quiz.quizId);
      const latest = latestQuizAttempt(courseQuizAttempts, course.id, quiz.quizId);
      const latestScorePercent = latest ? parseFloat(latest.score_percent || '0') : 0;
      const passed = latest ? latest.passed === 'true' : false;
      return {
        quizId: quiz.quizId,
        latestScorePercent: Number.isFinite(latestScorePercent) ? latestScorePercent : 0,
        passed,
        attempts: attempts.length,
      };
    });

    const totalTimeSeconds = lessons.reduce((acc, lesson) => acc + lesson.secondsActive, 0);
    const completed = lessons.length > 0 && lessons.every((lesson) => lesson.completed);
    const completedAt = completed
      ? lessons
          .map((lesson) => lesson.completedAt)
          .filter(Boolean)
          .sort()
          .pop()
      : undefined;

    const finalScore = computeFinalScore(course.id, quizzesInCourse, courseQuizAttempts);

    if (completed && persistCompletions) {
      await persistCompletion(userId, course.id, completedAt || new Date().toISOString(), finalScore, completionRow, event);
    }

    courses.push({
      courseId: course.id,
      courseName: course.title,
      totalTimeSeconds,
      lessons,
      quizzes,
      completed,
      completedAt: completionRow?.completed_at || completedAt,
      finalScore,
      certificateId: completionRow?.certificate_id || '',
      certificateCode: certificateRow?.certificate_code || '',
      certificateIssuedAt: certificateRow?.issued_at || '',
      steps: steps.map((step) => ({
        stepId: step.stepId,
        completed: lessons.find((lesson) => lesson.lessonId === step.stepId)?.completed || false,
        completedAt: lessons.find((lesson) => lesson.lessonId === step.stepId)?.completedAt,
      })),
    });
  }

  return courses;
}

export async function getCourseProgress(
  userId: string,
  courseId: string,
  options: { persistCompletions?: boolean; event?: HandlerEvent } = {}
): Promise<CourseProgressSummary | null> {
  const course = getCourse(courseId);
  if (!course) return null;
  const progress = await buildProgress(userId, options);
  return progress.find((c) => c.courseId === courseId) || null;
}
