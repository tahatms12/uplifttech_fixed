import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { Course } from '../../data/training/trainingCatalog';
import { flattenLessons } from '../../data/training/trainingCatalog';
import { progressService } from './ProgressService';

interface ContinueLearningPanelProps {
  courses: Course[];
}

const ContinueLearningPanel: React.FC<ContinueLearningPanelProps> = ({ courses }) => {
  const resume = useMemo(() => {
    for (const course of courses) {
      const lessonIds = flattenLessons(course).map((lesson) => lesson.id);
      const nextLessonId = progressService.getNextLessonId(course.id, lessonIds);
      const progressPercent = progressService.getProgressPercent(course.id, lessonIds);
      if (progressPercent > 0 && progressPercent < 100) {
        const nextLesson = flattenLessons(course).find((lesson) => lesson.id === nextLessonId);
        return { course, nextLessonId, nextLessonTitle: nextLesson?.title };
      }
    }
    return null;
  }, [courses]);

  if (!resume) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
        <h2 className="text-lg font-semibold">Continue learning</h2>
        <p className="text-sm text-gray-300">Start a course to see your next lesson here.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-2">
      <h2 className="text-lg font-semibold">Continue learning</h2>
      <p className="text-sm text-gray-300">Resume where you left off.</p>
      <div className="text-sm text-gray-200">
        <div className="font-medium">{resume.course.title}</div>
        <div className="text-xs text-gray-400">Next lesson: {resume.nextLessonTitle}</div>
      </div>
      <Link
        to={`/training/course/${resume.course.id}/learn/${resume.nextLessonId}`}
        className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded focus-visible:ring-2 focus-visible:ring-indigo-400"
      >
        Resume lesson
      </Link>
    </div>
  );
};

export default ContinueLearningPanel;
