import React from 'react';
import type { Course, Lesson } from '../../data/training/trainingCatalog';
import { progressService } from './ProgressService';

interface StepperOutlineProps {
  course: Course;
  activeLessonId: string;
  onSelectLesson: (lesson: Lesson) => void;
}

const StepperOutline: React.FC<StepperOutlineProps> = ({ course, activeLessonId, onSelectLesson }) => {
  return (
    <nav aria-label="Course outline" className="space-y-4">
      {course.sections.map((section) => (
        <div key={section.id} className="space-y-2">
          <h3 className="text-xs uppercase tracking-wide text-gray-400">{section.title}</h3>
          <ul role="list" className="space-y-1">
            {section.lessons.map((lesson) => {
              const status = progressService.getLessonStatus(course.id, lesson.id);
              const isActive = lesson.id === activeLessonId;
              return (
                <li key={lesson.id}>
                  <button
                    type="button"
                    className={`w-full text-left px-2 py-1 rounded text-sm focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                      isActive ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-200'
                    }`}
                    aria-current={isActive ? 'step' : undefined}
                    onClick={() => onSelectLesson(lesson)}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span>{lesson.title}</span>
                      {status.completed ? <span aria-hidden="true">✓</span> : null}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
};

export default StepperOutline;
