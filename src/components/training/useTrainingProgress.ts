import { useCallback, useEffect, useMemo, useState } from 'react';
import { trainingApi } from '../../lib/trainingApi';

export interface LessonProgressSummary {
  lessonId: string;
  title?: string;
  type?: string;
  dayNumber?: number;
  secondsActive: number;
  completed: boolean;
  completedAt?: string;
  completionReason?: 'time' | 'quiz' | 'manual';
  hasQuiz: boolean;
  quizId?: string;
  quizPassed: boolean;
  locked: boolean;
  lockedReason?: string;
}

export interface CourseProgressSummary {
  courseId: string;
  courseName: string;
  totalTimeSeconds: number;
  lessons: LessonProgressSummary[];
  quizzes: { quizId: string; latestScorePercent: number; passed: boolean; attempts: number }[];
  completed: boolean;
  completedAt?: string;
  finalScore: number | null;
  certificateId?: string;
  certificateCode?: string;
  certificateIssuedAt?: string;
  steps: { stepId: string; completed: boolean; completedAt?: string }[];
}

interface UseTrainingProgressOptions {
  courseId?: string;
}

export function useTrainingProgress(options: UseTrainingProgressOptions = {}) {
  const { courseId } = options;
  const [progress, setProgress] = useState<CourseProgressSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    const res = await trainingApi.progress();
    if (res.status === 200) {
      const payload = res.data as any;
      const courses = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.progress)
          ? payload.progress
          : Array.isArray(payload?.courses)
            ? payload.courses
            : [];
      setProgress(courses as CourseProgressSummary[]);
      setError(null);
    } else if (res.status === 401) {
      setError('unauthorized');
      setProgress([]);
    } else {
      setError(res.error || 'Unable to load progress.');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const progressByCourse = useMemo(
    () => new Map(progress.map((summary) => [summary.courseId, summary])),
    [progress]
  );
  const progressByStep = useMemo(() => {
    if (!courseId) return new Map<string, LessonProgressSummary>();
    const course = progress.find((summary) => summary.courseId === courseId);
    return new Map(course?.lessons?.map((lesson) => [lesson.lessonId, lesson]) || []);
  }, [courseId, progress]);

  return {
    progress,
    loading,
    error,
    refresh,
    progressByCourse,
    progressByStep,
  };
}
