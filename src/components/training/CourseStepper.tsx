import React from 'react';
import { useActiveTimeTracker } from './ActiveTimeTracker';
import { progressStore } from './ProgressStore';
import type { LessonProgressSummary } from './useTrainingProgress';
import { trainingApi } from '../../lib/trainingApi';
import TrainingMarkdown from './TrainingMarkdown';
import QuizEngine, { QuizProgressSnapshot } from './QuizEngine';
import PracticeActivity from './PracticeActivity';
import { buildPracticeActivity, buildModuleObjectives, isPracticeLesson } from '../../lib/trainingPolicy';

export interface LessonItem {
  id: string;
  title: string;
  contentMarkdown: string;
  checks?: { questions?: { id: string; question: string }[]; passingScore?: number }[];
}

interface CourseStepperProps {
  courseId: string;
  moduleId: string;
  moduleTitle: string;
  lessons: LessonItem[];
  activeLessonId?: string | null;
  lessonProgress?: Map<string, LessonProgressSummary>;
  quizProgress?: Map<string, QuizProgressSnapshot>;
  curriculumVersion?: string;
  catalogVersion?: string;
  onComplete?: (lessonId: string) => void;
  onLessonChange?: (lessonId: string) => void;
}

const CourseStepper: React.FC<CourseStepperProps> = ({
  courseId,
  moduleId,
  moduleTitle,
  lessons,
  activeLessonId,
  lessonProgress,
  quizProgress,
  curriculumVersion,
  catalogVersion,
  onComplete,
  onLessonChange,
}) => {
  const [activeLesson, setActiveLesson] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
  const [practiceCompleted, setPracticeCompleted] = React.useState<Record<string, boolean>>({});
  const objectives = React.useMemo(() => buildModuleObjectives(moduleTitle), [moduleTitle]);

  React.useEffect(() => {
    setActiveLesson(0);
  }, [moduleId]);

  React.useEffect(() => {
    if (!activeLessonId) return;
    const idx = lessons.findIndex((entry) => entry.id === activeLessonId);
    if (idx >= 0) setActiveLesson(idx);
  }, [activeLessonId, lessons]);

  const lesson = lessons[activeLesson];
  const activeProgress = lesson ? lessonProgress?.get(lesson.id) : undefined;
  if (!lesson) {
    return <div className="text-gray-400">Lessons not available.</div>;
  }
  useActiveTimeTracker({
    courseId,
    moduleId,
    lessonId: lesson.id,
    curriculumVersion,
    catalogVersion,
  });

  const markComplete = async () => {
    setError(null);
    const completedAt = new Date().toISOString();
    const eventId = crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`;
    await trainingApi.events({
      eventType: 'lesson_complete',
      courseId,
      moduleId,
      lessonId: lesson.id,
      completedAt,
      curriculumVersion,
      catalogVersion,
      idempotencyKey: eventId,
    });
    const res = await trainingApi.events({
      eventType: 'progress',
      courseId,
      moduleId,
      lessonId: lesson.id,
      completedAt,
      curriculumVersion,
      catalogVersion,
      idempotencyKey: `${eventId}-progress`,
    });
    if (res.status !== 200) {
      setError('Unable to save completion. Please try again.');
      return;
    }
    await progressStore.markStep(courseId, lesson.id, curriculumVersion);
    onComplete?.(lesson.id);
    if (activeLesson < lessons.length - 1) {
      const nextLesson = lessons[activeLesson + 1];
      setActiveLesson(activeLesson + 1);
      onLessonChange?.(nextLesson.id);
    }
  };

  React.useEffect(() => {
    if (!lesson) return;
    const eventId = crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`;
    trainingApi.events({
      eventType: 'lesson_start',
      courseId,
      moduleId,
      lessonId: lesson.id,
      curriculumVersion,
      catalogVersion,
      idempotencyKey: eventId,
    });
  }, [courseId, moduleId, lesson?.id, curriculumVersion, catalogVersion]);

  const handleSelectLesson = (idx: number) => {
    setActiveLesson(idx);
    onLessonChange?.(lessons[idx].id);
  };

  const quizDefinition = lesson.checks?.find((entry) => entry.questions && entry.questions.length);
  const quizId = quizDefinition ? `${courseId}:${lesson.id}` : null;
  const quizSnapshot = quizId ? quizProgress?.get(quizId) : undefined;
  const practiceActivity = isPracticeLesson(lesson.title) ? buildPracticeActivity(moduleTitle) : null;
  const canMarkComplete =
    Boolean(activeProgress?.completed) ||
    (!quizDefinition && !practiceActivity) ||
    (practiceActivity && practiceCompleted[lesson.id]) ||
    (quizSnapshot?.passed ?? false);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4" role="list">
        {lessons.map((item, idx) => {
          const progress = lessonProgress?.get(item.id);
          const isCompleted = progress?.completed;
          const locked = progress?.locked;
          return (
            <button
              key={item.id}
              role="listitem"
              className={`px-3 py-2 rounded border ${
                idx === activeLesson
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-gray-800 text-gray-200 border-gray-700'
              }`}
              onClick={() => handleSelectLesson(idx)}
            >
              {idx + 1}. {item.title} {isCompleted ? '✓ Completed' : locked ? '• Locked' : ''}
            </button>
          );
        })}
      </div>
      <div className="bg-gray-800 p-4 rounded" aria-live="polite">
        <h3 className="text-xl font-semibold mb-2">{lesson.title}</h3>
        {activeProgress ? (
          <div className="text-xs text-gray-400 mb-2">
            {activeProgress.completed ? (
              <span className="text-green-400">
                Completed {activeProgress.completedAt ? `on ${activeProgress.completedAt}` : ''}
              </span>
            ) : (
              <span>In progress</span>
            )}
            {activeProgress.secondsActive ? (
              <span className="ml-2">• {Math.round(activeProgress.secondsActive / 60)} min active</span>
            ) : null}
          </div>
        ) : null}
        {quizDefinition ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-300">
              Complete the knowledge check to unlock lesson completion. Answers are scored when you submit.
            </p>
            <QuizEngine
              courseId={courseId}
              moduleId={moduleId}
              lessonId={lesson.id}
              quizId={quizId || ''}
              questions={quizDefinition.questions || []}
              passingThresholdPercent={quizDefinition.passingScore}
              progress={quizSnapshot}
              objectives={objectives}
              curriculumVersion={curriculumVersion}
              catalogVersion={catalogVersion}
              onPass={markComplete}
            />
          </div>
        ) : practiceActivity ? (
          <PracticeActivity
            activity={practiceActivity}
            onComplete={() =>
              setPracticeCompleted((prev) => ({
                ...prev,
                [lesson.id]: true,
              }))
            }
          />
        ) : (
          <TrainingMarkdown content={lesson.contentMarkdown} />
        )}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            className={`px-4 py-2 rounded focus-visible:ring-2 focus-visible:ring-indigo-400 ${
              activeProgress?.completed || !canMarkComplete
                ? 'bg-gray-700 text-gray-300 cursor-not-allowed'
                : 'bg-indigo-600 text-white'
            }`}
            onClick={markComplete}
            disabled={activeProgress?.completed || !canMarkComplete}
          >
            {activeProgress?.completed ? 'Completed' : 'Mark complete'}
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              className="px-3 py-2 rounded bg-gray-700 text-gray-100 disabled:opacity-60"
              onClick={() => {
                if (activeLesson === 0) return;
                const nextIndex = activeLesson - 1;
                setActiveLesson(nextIndex);
                onLessonChange?.(lessons[nextIndex].id);
              }}
              disabled={activeLesson === 0}
            >
              Previous
            </button>
            <button
              type="button"
              className="px-3 py-2 rounded bg-gray-700 text-gray-100 disabled:opacity-60"
              onClick={() => {
                if (activeLesson >= lessons.length - 1) return;
                const nextIndex = activeLesson + 1;
                setActiveLesson(nextIndex);
                onLessonChange?.(lessons[nextIndex].id);
              }}
              disabled={activeLesson >= lessons.length - 1}
            >
              Next
            </button>
          </div>
          {error ? <div className="mt-2 text-xs text-red-400">{error}</div> : null}
        </div>
      </div>
    </div>
  );
};

export default CourseStepper;
