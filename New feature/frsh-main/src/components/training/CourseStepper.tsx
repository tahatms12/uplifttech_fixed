import React, { useMemo, useState } from 'react';
import DayStepper from './DayStepper';
import { useProgressStore } from './ProgressStore';
import type { Course } from '../../types/training';

type Props = {
  course: Course;
};

const CourseStepper: React.FC<Props> = ({ course }) => {
  const [activeDay, setActiveDay] = useState(1);
  const { courseProgress } = useProgressStore();
  const progress = courseProgress[course.id];

  const completion = useMemo(() => {
    const totalSteps = course.days.reduce((acc, d) => acc + d.steps.length, 0);
    const completed = progress?.completedSteps.length || 0;
    return Math.round((completed / totalSteps) * 100);
  }, [course.days, progress]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, day: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveDay(day);
    }
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between" aria-label="Course progress overview">
        <div>
          <h2 className="text-2xl font-bold">7-Day Plan</h2>
          <p className="text-sm text-gray-600">Completion: {completion || 0}%</p>
        </div>
        <div className="w-40 bg-gray-200 rounded-full h-3" role="progressbar" aria-valuenow={completion} aria-valuemin={0} aria-valuemax={100}>
          <div className="bg-indigo-600 h-3 rounded-full" style={{ width: `${completion}%` }} />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Day navigation">
        {course.days.map((day) => (
          <button
            key={day.dayNumber}
            role="tab"
            aria-selected={activeDay === day.dayNumber}
            aria-controls={`day-${day.dayNumber}`}
            onClick={() => setActiveDay(day.dayNumber)}
            onKeyDown={(e) => handleKeyDown(e, day.dayNumber)}
            className={`px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-offset-2 ${activeDay === day.dayNumber ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-800 border-gray-200'}`}
          >
            Day {day.dayNumber}
          </button>
        ))}
      </div>
      <div className="mt-4" role="tabpanel" id={`day-${activeDay}`}>
        {course.days
          .filter((d) => d.dayNumber === activeDay)
          .map((day) => (
            <DayStepper key={day.dayNumber} courseId={course.id} day={day} />
          ))}
      </div>
    </div>
  );
};

export default CourseStepper;
