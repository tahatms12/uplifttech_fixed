import React from 'react';
import { Link } from 'react-router-dom';
import type { Course } from '../../data/training/trainingCatalog';

interface CourseCardProps {
  course: Course;
  progressPercent: number;
  nextLessonTitle?: string | null;
  required?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, progressPercent, nextLessonTitle, required }) => {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{course.title}</h3>
          <p className="text-sm text-gray-300">{course.description}</p>
        </div>
        <span className="text-xs bg-indigo-700 text-white px-2 py-1 rounded">
          {Math.round(course.estMinutes / 60)}h
        </span>
      </div>
      <div className="flex flex-wrap gap-2 text-xs text-gray-300">
        <span className="bg-gray-800 px-2 py-1 rounded">{course.category}</span>
        <span className="bg-gray-800 px-2 py-1 rounded">{course.difficulty}</span>
        {required !== undefined ? (
          <span className={`px-2 py-1 rounded ${required ? 'bg-emerald-700' : 'bg-gray-700'}`}>
            {required ? 'Required' : 'Optional'}
          </span>
        ) : null}
      </div>
      {course.tags.length ? (
        <div className="flex flex-wrap gap-2 text-xs text-gray-400">
          {course.tags.map((tag) => (
            <span key={tag} className="bg-gray-800 px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
      ) : null}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-300">
          <span>Progress</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="h-2 bg-gray-800 rounded">
          <div className="h-2 bg-indigo-500 rounded" style={{ width: `${progressPercent}%` }} />
        </div>
        {nextLessonTitle ? (
          <div className="text-xs text-gray-400">Next lesson: {nextLessonTitle}</div>
        ) : null}
      </div>
      <div className="flex items-center justify-between">
        <Link
          to={`/training/course/${course.id}`}
          className="text-sm text-indigo-300 underline focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          View details
        </Link>
        <Link
          to={`/training/course/${course.id}`}
          className="text-sm px-3 py-1 rounded bg-indigo-600 text-white focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          {progressPercent > 0 ? 'Continue' : 'Start'}
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
