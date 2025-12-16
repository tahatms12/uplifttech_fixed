import React from 'react';

interface DayStepperProps {
  days: { dayNumber: number; dayTitle: string }[];
  activeDay: number;
  onSelect: (day: number) => void;
}

const DayStepper: React.FC<DayStepperProps> = ({ days, activeDay, onSelect }) => {
  return (
    <div role="tablist" aria-label="Course days" className="flex flex-wrap gap-2 mb-4">
      {days.map((day) => (
        <button
          key={day.dayNumber}
          role="tab"
          aria-selected={activeDay === day.dayNumber}
          aria-controls={`day-panel-${day.dayNumber}`}
          className={`px-3 py-2 rounded border ${activeDay === day.dayNumber ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-200'} focus-visible:ring-2 focus-visible:ring-indigo-400`}
          onClick={() => onSelect(day.dayNumber)}
        >
          Day {day.dayNumber}: {day.dayTitle}
        </button>
      ))}
    </div>
  );
};

export default DayStepper;
