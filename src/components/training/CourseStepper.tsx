import React from 'react';
import { useActiveTimeTracker } from './ActiveTimeTracker';
import { progressStore } from './ProgressStore';
import type { LessonProgressSummary } from './useTrainingProgress';
import { trainingApi } from '../../lib/trainingApi';
import TrainingMarkdown from './TrainingMarkdown';

export interface LessonItem {
  id: string;
  title: string;
  contentMarkdown: string;
}

interface CourseStepperProps {
  courseId: string;
  moduleId: string;
  lessons: LessonItem[];
  lessonProgress?: Map<string, LessonProgressSummary>;
  curriculumVersion?: string;
  catalogVersion?: string;
  onComplete?: (lessonId: string) => void;
}

const CourseStepper: React.FC<CourseStepperProps> = ({
  courseId,
  moduleId,
  lessons,
  lessonProgress,
  curriculumVersion,
  catalogVersion,
  onComplete,
}) => {
  const [activeLesson, setActiveLesson] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
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
    const res = await trainingApi.events({
      eventType: 'progress',
      courseId,
      moduleId,
      lessonId: lesson.id,
      completedAt,
      curriculumVersion,
      catalogVersion,
    });
    if (res.status !== 200) {
      setError('Unable to save completion. Please try again.');
      return;
    }
    await progressStore.markStep(courseId, lesson.id, curriculumVersion);
    onComplete?.(lesson.id);
    if (activeLesson < lessons.length - 1) {
      setActiveLesson(activeLesson + 1);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4" role="list">
        {lessons.map((item, idx) => {
          const progress = lessonProgress?.get(item.id);
          const isCompleted = progress?.completed;
          return (
            <button
              key={item.id}
              role="listitem"
              className={`px-3 py-2 rounded border ${
                idx === activeLesson ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-gray-800 text-gray-200 border-gray-700'
              }`}
              onClick={() => setActiveLesson(idx)}
            >
              {idx + 1}. {item.title} {isCompleted ? '✓' : ''}
            </button>
          );
        })}
      </div>
      <div className="bg-gray-800 p-4 rounded" aria-live="polite">
        <h3 className="text-xl font-semibold mb-2">{lesson.title}</h3>
        {activeProgress ? (
          <div className="text-xs text-gray-400 mb-2">
            {activeProgress.completed ? (
              <span className="text-green-400">Completed {activeProgress.completedAt ? `on ${activeProgress.completedAt}` : ''}</span>
            ) : (
              <span>In progress</span>
            )}
            {activeProgress.secondsActive ? (
              <span className="ml-2">• {Math.round(activeProgress.secondsActive / 60)} min active</span>
            ) : null}
          </div>
        ) : null}
        <TrainingMarkdown content={lesson.contentMarkdown} />
        <div className="mt-4">
          <button
            className={`px-4 py-2 rounded focus-visible:ring-2 focus-visible:ring-indigo-400 ${
              activeProgress?.completed ? 'bg-gray-700 text-gray-300 cursor-not-allowed' : 'bg-indigo-600 text-white'
            }`}
            onClick={markComplete}
            disabled={activeProgress?.completed}
          >
            {activeProgress?.completed ? 'Completed' : 'Mark complete'}
          </button>
          {error ? <div className="mt-2 text-xs text-red-400">{error}</div> : null}
        </div>
      </div>
    </div>
  );
};

export default CourseStepper;
