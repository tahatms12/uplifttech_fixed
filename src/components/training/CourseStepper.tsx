import React from 'react';
import { useActiveTimeTracker } from './ActiveTimeTracker';
import { progressStore } from './ProgressStore';

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
  onComplete?: (stepId: string) => void;
}

const CourseStepper: React.FC<CourseStepperProps> = ({ courseId, dayNumber, steps, onComplete }) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const step = steps[activeStep];
  useActiveTimeTracker({ courseId, stepId: step.stepId });

  const markComplete = async () => {
    await progressStore.markStep(courseId, step.stepId);
    onComplete?.(step.stepId);
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-4" role="list">
        {steps.map((s, idx) => (
          <button
            key={s.stepId}
            role="listitem"
            className={`px-3 py-2 rounded ${idx === activeStep ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-200'}`}
            onClick={() => setActiveStep(idx)}
          >
            {idx + 1}. {s.title}
          </button>
        ))}
      </div>
      <div className="bg-gray-800 p-4 rounded" aria-live="polite">
        <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
        <p className="text-sm text-gray-300 mb-2">Type: {step.type}</p>
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
            className="px-4 py-2 bg-indigo-600 text-white rounded focus-visible:ring-2 focus-visible:ring-indigo-400"
            onClick={markComplete}
          >
            Mark complete
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-400">Acceptance criteria: {step.acceptanceCriteria.join('; ')}</div>
      </div>
    </div>
  );
};

export default CourseStepper;
