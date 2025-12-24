import React, { useMemo, useState } from 'react';
import type { Course, Lesson } from '../../data/training/trainingCatalog';
import { flattenLessons } from '../../data/training/trainingCatalog';
import StepperOutline from './StepperOutline';
import LessonRenderer from './LessonRenderer';
import { progressService } from './ProgressService';

interface CoursePlayerLayoutProps {
  course: Course;
  activeLesson: Lesson;
  onSelectLesson: (lessonId: string) => void;
  onMarkComplete: () => void;
  onQuizPass: () => void;
}

const CoursePlayerLayout: React.FC<CoursePlayerLayoutProps> = ({
  course,
  activeLesson,
  onSelectLesson,
  onMarkComplete,
  onQuizPass,
}) => {
  const [outlineOpen, setOutlineOpen] = useState(true);
  const lessons = useMemo(() => flattenLessons(course), [course]);
  const lessonIndex = lessons.findIndex((lesson) => lesson.id === activeLesson.id);
  const prevLesson = lessonIndex > 0 ? lessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < lessons.length - 1 ? lessons[lessonIndex + 1] : null;
  const progressPercent = progressService.getProgressPercent(course.id, lessons.map((lesson) => lesson.id));

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="space-y-3">
        <button
          type="button"
          className="w-full text-left text-sm text-indigo-300 underline"
          onClick={() => setOutlineOpen((prev) => !prev)}
          aria-expanded={outlineOpen}
        >
          {outlineOpen ? 'Hide outline' : 'Show outline'}
        </button>
        {outlineOpen ? (
          <StepperOutline
            course={course}
            activeLessonId={activeLesson.id}
            onSelectLesson={(lesson) => onSelectLesson(lesson.id)}
          />
        ) : null}
      </aside>
      <section className="space-y-6">
        <header className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">{course.title}</h1>
              <p className="text-sm text-gray-300">{course.description}</p>
            </div>
            <div className="text-xs text-gray-300">Estimated: {Math.round(course.estMinutes / 60)}h</div>
          </div>
          <div>
            <div className="flex items-center justify-between text-xs text-gray-300">
              <span>Overall progress</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-2 bg-gray-800 rounded">
              <div className="h-2 bg-indigo-500 rounded" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
          <div className="text-xs text-amber-300">
            Completion does not confer HIPAA certification. Training content uses fictional or de-identified examples only.
          </div>
        </header>

        <article className="bg-gray-900 border border-gray-700 rounded-lg p-6 space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-white">{activeLesson.title}</h2>
            <p className="text-xs text-gray-400">Estimated time: {activeLesson.estMinutes} min</p>
          </div>
          <LessonRenderer courseId={course.id} lesson={activeLesson} onQuizPass={onQuizPass} />
        </article>

        <div className="sticky bottom-4 bg-gray-900 border border-gray-700 rounded-lg p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            <button
              type="button"
              className="px-3 py-2 rounded bg-gray-800 text-white focus-visible:ring-2 focus-visible:ring-indigo-400"
              onClick={() => prevLesson && onSelectLesson(prevLesson.id)}
              disabled={!prevLesson}
            >
              Previous
            </button>
            <button
              type="button"
              className="px-3 py-2 rounded bg-gray-800 text-white focus-visible:ring-2 focus-visible:ring-indigo-400"
              onClick={() => nextLesson && onSelectLesson(nextLesson.id)}
              disabled={!nextLesson}
            >
              Next
            </button>
          </div>
          <button
            type="button"
            className="px-4 py-2 rounded bg-indigo-600 text-white focus-visible:ring-2 focus-visible:ring-indigo-400"
            onClick={onMarkComplete}
          >
            Mark complete
          </button>
        </div>
      </section>
    </div>
  );
};

export default CoursePlayerLayout;
