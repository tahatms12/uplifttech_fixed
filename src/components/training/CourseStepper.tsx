import React from 'react';
import { useActiveTimeTracker } from './ActiveTimeTracker';
import { progressStore } from './ProgressStore';
import type { LessonProgressSummary } from './useTrainingProgress';
import { trainingApi } from '../../lib/trainingApi';

export interface StepItem {
  stepId: string;
  title: string;
  type: string;
  contentBlocks: string[];
  activities: string[];
  acceptanceCriteria: string[];
  assessment?: { questions: { question: string }[] };
}

interface CourseStepperProps {
  courseId: string;
  dayNumber: number;
  steps: StepItem[];
  stepProgress?: Map<string, LessonProgressSummary>;
  onComplete?: (stepId: string) => void;
}

const CourseStepper: React.FC<CourseStepperProps> = ({ courseId, dayNumber, steps, stepProgress, onComplete }) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
  const step = steps[activeStep];
  const activeProgress = stepProgress?.get(step.stepId);
  useActiveTimeTracker({ courseId, stepId: step.stepId });

  const markComplete = async () => {
    setError(null);
    const completedAt = new Date().toISOString();
    const res = await trainingApi.events({
      eventType: 'progress',
      courseId,
      moduleId: String(dayNumber),
      lessonId: step.stepId,
      completedAt,
    });
    if (res.status !== 200) {
      setError('Unable to save completion. Please try again.');
      return;
    }
    await progressStore.markStep(courseId, step.stepId);
    onComplete?.(step.stepId);
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-4" role="list">
        {steps.map((s, idx) => {
          const progress = stepProgress?.get(s.stepId);
          const isCompleted = progress?.completed;
          return (
          <button
            key={s.stepId}
            role="listitem"
            className={`px-3 py-2 rounded border ${idx === activeStep ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-gray-800 text-gray-200 border-gray-700'}`}
            onClick={() => setActiveStep(idx)}
          >
            {idx + 1}. {s.title} {isCompleted ? '✓' : ''}
          </button>
        );
        })}
      </div>
      <div className="bg-gray-800 p-4 rounded" aria-live="polite">
        <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
        <p className="text-sm text-gray-300 mb-2">Type: {step.type}</p>
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
        <div className="space-y-2">
          {step.contentBlocks.map((block, idx) => (
            <p key={idx} className="text-gray-100">
              {block}
            </p>
          ))}
        </div>
        {step.activities.length > 0 && (
          <div className="mt-3">
            <h4 className="font-semibold">Activities</h4>
            <ul className="list-disc ml-5 text-gray-100">
              {step.activities.map((activity, idx) => (
                <li key={idx}>{activity}</li>
              ))}
            </ul>
          </div>
        )}
        {step.assessment && (
          <div className="mt-3">
            <h4 className="font-semibold">Check your knowledge</h4>
            <ul className="list-disc ml-5 text-gray-100">
              {step.assessment.questions.map((q, idx) => (
                <li key={idx}>{q.question}</li>
              ))}
            </ul>
          </div>
        )}
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
        <div className="mt-2 text-xs text-gray-400">Acceptance criteria: {step.acceptanceCriteria.join('; ')}</div>
      </div>
    </div>
  );
};

export default CourseStepper;
