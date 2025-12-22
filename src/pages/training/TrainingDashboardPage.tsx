import React, { useMemo, useState } from 'react';
import curriculum from '../../data/training/exports/curriculum.generated.json';
import TrainingNoIndexHelmet from '../../components/training/TrainingNoIndexHelmet';
import { Link } from 'react-router-dom';
import { useTrainingProgress } from '../../components/training/useTrainingProgress';
import { useTrainingRole } from '../../hooks/useTrainingRole';
import { trainingApi } from '../../lib/trainingApi';

const TrainingDashboardPage: React.FC = () => {
  const { role, setRole } = useTrainingRole();
  const [query, setQuery] = useState('');
  const { loading: progressLoading, error: progressError, progressByCourse } = useTrainingProgress();

  const courses = (curriculum as any).courses || [];
  const roleOptions = useMemo(() => {
    const roles = new Set<string>();
    courses.forEach((course: any) => {
      const audience = course.audience || course.roleTags || [];
      audience.forEach((entry: string) => roles.add(entry));
    });
    return Array.from(roles).sort();
  }, [courses]);

  const filtered = useMemo(() => {
    return courses.filter((course: any) => {
      const courseRoles = course.audience || course.roleTags || [];
      const matchesRole = role ? courseRoles.includes(role) : true;
      const matchesQuery = query
        ? course.title.toLowerCase().includes(query.toLowerCase()) ||
          (course.description || '').toLowerCase().includes(query.toLowerCase())
        : true;
      return matchesRole && matchesQuery;
    });
  }, [courses, role, query]);

  const resumeTarget = useMemo(() => {
    for (const course of courses) {
      const summary = progressByCourse.get(course.id);
      if (!summary || summary.completed) continue;
      const nextLesson = summary.lessons.find((lesson) => !lesson.completed);
      if (nextLesson) {
        const moduleId = nextLesson.moduleId || course.modules?.[0]?.id;
        return {
          courseId: course.id,
          moduleId,
          lessonId: nextLesson.lessonId,
        };
      }
    }
    return null;
  }, [courses, progressByCourse]);

  const handleResume = async () => {
    if (!resumeTarget) return;
    await trainingApi.events({
      eventType: 'resume',
      courseId: resumeTarget.courseId,
      moduleId: resumeTarget.moduleId,
      lessonId: resumeTarget.lessonId,
      idempotencyKey: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
    });
  };

  return (
    <div className="space-y-4">
      <TrainingNoIndexHelmet />
      <h1 className="text-2xl font-bold">Training Dashboard</h1>
      {progressLoading ? <p className="text-sm text-gray-400">Loading progress...</p> : null}
      {progressError && !progressLoading ? <p className="text-sm text-red-400">Progress unavailable.</p> : null}
      <div className="text-xs text-amber-300">
        Completion does not confer HIPAA certification. Training content uses fictional or de-identified examples only.
      </div>

      {!role ? (
        <div className="bg-gray-800 p-3 rounded border border-amber-500 text-amber-200 text-sm">
          Select your role to see the correct learning pathway and locked prerequisites.
        </div>
      ) : null}
      <div className="grid md:grid-cols-3 gap-3">
        <label className="block text-sm">
          Role selection
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-gray-800 p-2 rounded border border-gray-700"
          >
            <option value="">Select a role</option>
            {roleOptions.map((entry) => (
              <option key={entry} value={entry}>
                {entry}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm md:col-span-2">
          Search
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-gray-800 p-2 rounded border border-gray-700"
          />
        </label>
      </div>

      {resumeTarget ? (
        <Link
          to={`/training/course/${resumeTarget.courseId}/module/${resumeTarget.moduleId}/lesson/${resumeTarget.lessonId}`}
          onClick={handleResume}
          className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          Resume last lesson
        </Link>
      ) : null}

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((course: any) => {
          const prerequisites = course.prerequisites || [];
          const roleSelected = Boolean(role);
          const prerequisitesMet = prerequisites.every((courseId: string) => progressByCourse.get(courseId)?.completed);
          return (
          <div key={course.id} className="p-4 bg-gray-800 rounded border border-gray-700">
            {(() => {
              const summary = progressByCourse.get(course.id);
              const totalLessons =
                summary?.lessons?.length ??
                (course.modules || []).reduce((acc: number, module: any) => acc + (module.lessons?.length || 0), 0);
              const completedLessons = summary?.lessons?.filter((lesson) => lesson.completed).length ?? 0;
              const percent = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;
              return (
                <div className="mb-2 text-xs text-gray-400">
                  {summary?.completed ? (
                    <span className="text-green-400">
                      Completed {summary.completedAt ? `on ${summary.completedAt}` : ''}
                    </span>
                  ) : (
                    <span>
                      Progress: {completedLessons}/{totalLessons} ({percent}%)
                    </span>
                  )}
                  {summary?.totalTimeSeconds ? (
                    <span className="ml-2">• {Math.round(summary.totalTimeSeconds / 60)} min active</span>
                  ) : null}
                </div>
              );
            })()}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">{course.title}</h2>
                <p className="text-sm text-gray-300">{course.description || 'Not specified.'}</p>
              </div>
              <span className="text-xs bg-indigo-700 text-white px-2 py-1 rounded">
                {course.estimatedMinutes ? `${Math.round(course.estimatedMinutes / 60)}h` : 'Not specified'}
              </span>
            </div>
            <div className="mt-2 text-xs text-gray-400">
              Audience: {(course.audience || course.roleTags || []).join(', ') || 'Not specified'}
            </div>
            {roleSelected && prerequisitesMet ? (
              <Link
                to={`/training/course/${course.id}/module/${course.modules?.[0]?.id}/lesson/${course.modules?.[0]?.lessons?.[0]?.id}`}
                className="inline-block mt-3 px-3 py-2 bg-indigo-600 text-white rounded focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                Open course
              </Link>
            ) : (
              <div className="mt-3 text-xs text-amber-300">
                {!roleSelected
                  ? 'Select a role to unlock this course.'
                  : `Locked. Complete prerequisites: ${prerequisites.join(', ')}.`}
              </div>
            )}
          </div>
        )})}
      </div>
    </div>
  );
};

export default TrainingDashboardPage;
