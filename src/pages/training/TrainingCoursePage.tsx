import React, { useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import TrainingNoIndexHelmet from '../../components/training/TrainingNoIndexHelmet';
import { flattenLessons, getCourseById } from '../../data/training/trainingCatalog';
import { progressService } from '../../components/training/ProgressService';
import { useTrainingRole } from '../../hooks/useTrainingRole';

const TrainingCoursePage: React.FC = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { role } = useTrainingRole();

  const course = useMemo(() => (courseId ? getCourseById(courseId) : null), [courseId]);

  if (!course) {
    return (
      <div className="space-y-3">
        <TrainingNoIndexHelmet />
        <h1 className="text-2xl font-bold">Course not found</h1>
        <Link to="/training/dashboard" className="text-indigo-300 underline">
          Return to dashboard
        </Link>
      </div>
    );
  }

  const lessons = flattenLessons(course);
  const lessonIds = lessons.map((lesson) => lesson.id);
  const progressPercent = progressService.getProgressPercent(course.id, lessonIds);
  const nextLessonId = progressService.getNextLessonId(course.id, lessonIds);
  const nextLessonTitle = lessons.find((lesson) => lesson.id === nextLessonId)?.title;
  const required = role ? course.roleMappings[role]?.required : undefined;

  const handleStart = () => {
    navigate(`/training/course/${course.id}/learn/${nextLessonId}`);
  };

  return (
    <div className="space-y-6">
      <TrainingNoIndexHelmet />
      <nav aria-label="Breadcrumb" className="text-sm text-gray-300">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link to="/training/dashboard" className="underline text-indigo-300">
              Dashboard
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>{course.title}</li>
        </ol>
      </nav>

      <header className="space-y-3">
        <h1 className="text-2xl font-bold">{course.title}</h1>
        <p className="text-gray-300">{course.description}</p>
        <div className="flex flex-wrap gap-2 text-xs text-gray-300">
          <span className="bg-gray-800 px-2 py-1 rounded">{course.category}</span>
          <span className="bg-gray-800 px-2 py-1 rounded">{course.difficulty}</span>
          <span className="bg-gray-800 px-2 py-1 rounded">Estimated {Math.round(course.estMinutes / 60)}h</span>
          {required !== undefined ? (
            <span className={`px-2 py-1 rounded ${required ? 'bg-emerald-700' : 'bg-gray-700'}`}>
              {required ? 'Required for your role' : 'Optional for your role'}
            </span>
          ) : null}
        </div>
        <div className="text-xs text-amber-300">
          Completion does not confer HIPAA certification. Training content uses fictional or de-identified examples only.
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-2">
          <h2 className="text-lg font-semibold">What you will learn</h2>
          <ul className="list-disc list-inside text-sm text-gray-300">
            {course.objectives.map((objective) => (
              <li key={objective}>{objective}</li>
            ))}
          </ul>
        </div>
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-2">
          <h2 className="text-lg font-semibold">Requirements & prerequisites</h2>
          <ul className="list-disc list-inside text-sm text-gray-300">
            {course.requirements.map((item) => (
              <li key={item}>{item}</li>
            ))}
            {course.prerequisites.length ? (
              course.prerequisites.map((item) => <li key={item}>{item}</li>)
            ) : (
              <li>No prerequisites listed.</li>
            )}
          </ul>
        </div>
      </section>

      <section className="bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-3">
        <h2 className="text-lg font-semibold">Course outline</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {course.sections.map((section) => (
            <div key={section.id} className="text-sm text-gray-300">
              <div className="font-medium text-gray-100">{section.title}</div>
              <div className="text-xs text-gray-400">{section.lessons.length} lessons</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-2">
        <h2 className="text-lg font-semibold">Assessments</h2>
        <ul className="list-disc list-inside text-sm text-gray-300">
          {course.assessments.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="bg-gray-900 border border-gray-700 rounded-lg p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="text-sm text-gray-300">
          Progress: {progressPercent}% {nextLessonTitle ? `• Next lesson: ${nextLessonTitle}` : ''}
        </div>
        <button
          type="button"
          className="px-4 py-2 rounded bg-indigo-600 text-white focus-visible:ring-2 focus-visible:ring-indigo-400"
          onClick={handleStart}
        >
          {progressPercent > 0 ? 'Continue course' : 'Start course'}
        </button>
      </section>
    </div>
  );
};

export default TrainingCoursePage;
