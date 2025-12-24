export interface CourseProgressState {
  courseId: string;
  completedLessons: string[];
  lessonCompletedAt: Record<string, string>;
  lastLessonId?: string;
  completedAt?: string;
  quizAttempts: Record<
    string,
    { attempts: number; bestScore: number; lastScore: number; lastAttemptAt?: string; passed: boolean }
  >;
}

export interface TrainingProgressState {
  courses: Record<string, CourseProgressState>;
}

const STORAGE_KEY = 'training-progress-v2';
const EVENT_NAME = 'training-progress-updated';

const defaultState = (): TrainingProgressState => ({ courses: {} });

export class ProgressService {
  load(): TrainingProgressState {
    if (typeof window === 'undefined') return defaultState();
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    try {
      return JSON.parse(raw) as TrainingProgressState;
    } catch {
      return defaultState();
    }
  }

  save(state: TrainingProgressState) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  }

  getCourseState(courseId: string): CourseProgressState {
    const state = this.load();
    return (
      state.courses[courseId] ?? {
        courseId,
        completedLessons: [],
        lessonCompletedAt: {},
        quizAttempts: {},
      }
    );
  }

  recordLessonVisit(courseId: string, lessonId: string) {
    const state = this.load();
    const course = state.courses[courseId] ?? {
      courseId,
      completedLessons: [],
      lessonCompletedAt: {},
      quizAttempts: {},
    };
    course.lastLessonId = lessonId;
    state.courses[courseId] = course;
    this.save(state);
  }

  markLessonComplete(courseId: string, lessonId: string, totalLessons: number) {
    const state = this.load();
    const course = state.courses[courseId] ?? {
      courseId,
      completedLessons: [],
      lessonCompletedAt: {},
      quizAttempts: {},
    };
    if (!course.completedLessons.includes(lessonId)) {
      course.completedLessons.push(lessonId);
    }
    course.lessonCompletedAt[lessonId] = new Date().toISOString();
    course.lastLessonId = lessonId;
    if (course.completedLessons.length >= totalLessons && !course.completedAt) {
      course.completedAt = new Date().toISOString();
    }
    state.courses[courseId] = course;
    this.save(state);
  }

  recordQuizAttempt(courseId: string, quizId: string, score: number, passed: boolean) {
    const state = this.load();
    const course = state.courses[courseId] ?? {
      courseId,
      completedLessons: [],
      lessonCompletedAt: {},
      quizAttempts: {},
    };
    const previous = course.quizAttempts[quizId] ?? {
      attempts: 0,
      bestScore: 0,
      lastScore: 0,
      passed: false,
    };
    const next = {
      attempts: previous.attempts + 1,
      bestScore: Math.max(previous.bestScore, score),
      lastScore: score,
      lastAttemptAt: new Date().toISOString(),
      passed: previous.passed || passed,
    };
    course.quizAttempts[quizId] = next;
    state.courses[courseId] = course;
    this.save(state);
  }

  getLessonStatus(courseId: string, lessonId: string) {
    const course = this.getCourseState(courseId);
    return {
      completed: course.completedLessons.includes(lessonId),
      completedAt: course.lessonCompletedAt[lessonId],
    };
  }

  getProgressPercent(courseId: string, lessonIds: string[]) {
    const course = this.getCourseState(courseId);
    if (!lessonIds.length) return 0;
    const completed = lessonIds.filter((id) => course.completedLessons.includes(id)).length;
    return Math.round((completed / lessonIds.length) * 100);
  }

  getNextLessonId(courseId: string, lessonIds: string[]) {
    const course = this.getCourseState(courseId);
    const next = lessonIds.find((lessonId) => !course.completedLessons.includes(lessonId));
    return next ?? lessonIds[lessonIds.length - 1];
  }
}

export const progressService = new ProgressService();
