import { useCallback, useEffect, useState } from 'react';
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

export function useTrainingProgress() {
  const [progress, setProgress] = useState<CourseProgressSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    const res = await trainingApi.progress();
    if (res.status === 200 && Array.isArray(res.data)) {
      setProgress(res.data as CourseProgressSummary[]);
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

  return { progress, loading, error, refresh };
}
