import React, { useMemo, useState } from 'react';
import curriculum from '../../data/training/exports/curriculum.generated.json';
import TrainingNoIndexHelmet from '../../components/training/TrainingNoIndexHelmet';
import { Link } from 'react-router-dom';
import { useTrainingProgress } from '../../components/training/useTrainingProgress';

const TrainingDashboardPage: React.FC = () => {
  const [role, setRole] = useState('');
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

  return (
    <div className="space-y-4">
      <TrainingNoIndexHelmet />
      <h2 className="text-2xl font-bold">Training Dashboard</h2>
      {progressLoading ? <p className="text-sm text-gray-400">Loading progress...</p> : null}
      {progressError && !progressLoading ? <p className="text-sm text-red-400">Progress unavailable.</p> : null}
      <div className="grid md:grid-cols-3 gap-3">
        <label className="block text-sm">Role filter
          <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full bg-gray-800 p-2 rounded border border-gray-700">
            <option value="">All roles</option>
            {roleOptions.map((entry) => (
              <option key={entry} value={entry}>{entry}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm md:col-span-2">Search
          <input value={query} onChange={(e) => setQuery(e.target.value)} className="w-full bg-gray-800 p-2 rounded border border-gray-700" />
        </label>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((course: any) => (
          <div key={course.id} className="p-4 bg-gray-800 rounded border border-gray-700">
            {(() => {
              const summary = progressByCourse.get(course.id);
              const totalLessons = summary?.lessons?.length ?? (course.modules || []).reduce((acc: number, module: any) => acc + (module.lessons?.length || 0), 0);
              const completedLessons = summary?.lessons?.filter((lesson) => lesson.completed).length ?? 0;
              const percent = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;
              return (
                <div className="mb-2 text-xs text-gray-400">
                  {summary?.completed ? (
                    <span className="text-green-400">Completed {summary.completedAt ? `on ${summary.completedAt}` : ''}</span>
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
                <h3 className="text-xl font-semibold">{course.title}</h3>
                <p className="text-sm text-gray-300">{course.description || 'Not specified.'}</p>
              </div>
              <span className="text-xs bg-indigo-700 text-white px-2 py-1 rounded">
                {course.estimatedMinutes ? `${Math.round(course.estimatedMinutes / 60)}h` : 'Not specified'}
              </span>
            </div>
            <div className="mt-2 text-xs text-gray-400">
              Audience: {(course.audience || course.roleTags || []).join(', ') || 'Not specified'}
            </div>
            <Link to={`/training/course/${course.id}`} className="inline-block mt-3 px-3 py-2 bg-indigo-600 text-white rounded focus-visible:ring-2 focus-visible:ring-indigo-400">
              Open course
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainingDashboardPage;
