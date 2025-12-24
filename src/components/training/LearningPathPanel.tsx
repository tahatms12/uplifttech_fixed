import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { Course } from '../../data/training/trainingCatalog';
import { flattenLessons } from '../../data/training/trainingCatalog';
import { progressService } from './ProgressService';

interface LearningPathPanelProps {
  roleId?: string;
  courses: Course[];
}

const LearningPathPanel: React.FC<LearningPathPanelProps> = ({ roleId, courses }) => {
  const ordered = useMemo(() => {
    if (!roleId) return [];
    return [...courses]
      .filter((course) => course.roleMappings[roleId])
      .sort((a, b) => a.roleMappings[roleId].order - b.roleMappings[roleId].order);
  }, [courses, roleId]);

  if (!roleId) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
        <h2 className="text-lg font-semibold">Role learning path</h2>
        <p className="text-sm text-gray-300">Select a role to see your required learning path.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-3">
      <h2 className="text-lg font-semibold">Role learning path</h2>
      <ol className="space-y-2 text-sm text-gray-300">
        {ordered.map((course) => {
          const lessonIds = flattenLessons(course).map((lesson) => lesson.id);
          const progressPercent = progressService.getProgressPercent(course.id, lessonIds);
          const nextLessonId = progressService.getNextLessonId(course.id, lessonIds);
          return (
            <li key={course.id} className="flex items-start justify-between gap-3">
              <div>
                <div className="font-medium text-gray-100">{course.title}</div>
                <div className="text-xs text-gray-400">{progressPercent}% complete</div>
              </div>
              <Link
                to={`/training/course/${course.id}/learn/${nextLessonId}`}
                className="text-xs text-indigo-300 underline"
              >
                {progressPercent > 0 ? 'Continue' : 'Start'}
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default LearningPathPanel;
