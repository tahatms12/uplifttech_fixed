import React from 'react';
import { useProgressStore } from './ProgressStore';
import type { CourseDay, CourseStep } from '../../types/training';

type Props = {
  courseId: string;
  day: CourseDay;
};

const DayStepper: React.FC<Props> = ({ courseId, day }) => {
  const { courseProgress, toggleStep, setLastStep } = useProgressStore();
  const completed = courseProgress[courseId]?.completedSteps || [];

  const handleToggle = (step: CourseStep) => {
    toggleStep(courseId, step.stepId);
    setLastStep(courseId, step.stepId);
  };

  return (
    <div aria-label={`Day ${day.dayNumber} stepper`} role="group" className="space-y-4">
      {day.steps.map((step, idx) => {
        const isDone = completed.includes(step.stepId);
        return (
          <div
            key={step.stepId}
            className={`border rounded-lg p-4 focus-within:ring-2 focus-within:ring-indigo-500 ${isDone ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">Step {idx + 1} · {step.type}</p>
                <h3 className="text-lg font-semibold" id={`${step.stepId}-label`}>
                  {step.title}
                </h3>
              </div>
              <button
                aria-pressed={isDone}
                onClick={() => handleToggle(step)}
                className={`ml-4 px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDone ? 'bg-green-600 text-white focus:ring-green-600' : 'bg-gray-100 text-gray-800 focus:ring-indigo-500'}`}
              >
                {isDone ? 'Completed' : 'Mark complete'}
              </button>
            </div>
            <div className="mt-2 space-y-2" aria-describedby={`${step.stepId}-label`}>
              {step.contentBlocks.map((block, i) => (
                <p key={i} className="text-sm text-gray-700 whitespace-pre-line">{block}</p>
              ))}
              <div>
                <h4 className="font-semibold text-sm">Activities</h4>
                <ul className="list-disc ml-5 text-sm">
                  {step.activities.map((act, i) => (
                    <li key={i}>{act}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-sm">Acceptance criteria</h4>
                <ul className="list-disc ml-5 text-sm">
                  {step.acceptanceCriteria.map((crit, i) => (
                    <li key={i}>{crit}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DayStepper;
