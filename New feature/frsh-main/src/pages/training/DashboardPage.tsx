import React, { useEffect, useMemo } from 'react';
import { catalog, fetchProgress, logout } from '../../lib/trainingApi';
import { useTrainingUser } from '../../lib/useTrainingUser';
import { useNavigate, Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { user, loading, setUser } = useTrainingUser();
  const navigate = useNavigate();
  const [progress, setProgress] = React.useState<any>(null);
  const [error, setError] = React.useState('');

  useEffect(() => {
    const meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      const m = document.createElement('meta');
      m.name = 'robots';
      m.content = 'noindex,nofollow';
      document.head.appendChild(m);
    } else {
      meta.content = 'noindex,nofollow';
    }
  }, []);

  useEffect(() => {
    if (!loading && !user) navigate('/training');
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProgress()
        .then((res) => setProgress(res))
        .catch(() => setError('Could not load progress'));
    }
  }, [user]);

  const completions = useMemo(() => progress?.completions || [], [progress]);

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 text-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Training Dashboard</h1>
          <p className="text-sm text-gray-300">Welcome back, {user.full_name}</p>
        </div>
        <button
          className="text-sm underline"
          onClick={async () => {
            await logout();
            setUser(null);
            navigate('/training');
          }}
        >
          Sign out
        </button>
      </div>
      <p className="text-sm text-gray-300 mb-4">
        The portal records progress, lesson time, and quiz results for verification.
      </p>
      {error && <div className="text-red-400 mb-4">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" role="list">
        {catalog.map((course) => {
          const done = completions.some((c: any) => c.course_id === course.id);
          return (
            <div key={course.id} className="p-4 border border-gray-700 rounded" role="listitem">
              <h2 className="text-xl font-semibold">{course.title}</h2>
              <p className="text-sm text-gray-300 mb-2">{course.summary}</p>
              <div className="text-xs text-gray-400 mb-2">Duration: {course.durationPlan}-day plan</div>
              <Link
                to={`/training/course/${course.slug}`}
                className="inline-flex items-center text-primary underline"
              >
                {done ? 'Review course' : 'Start course'}
              </Link>
              {done && <div className="text-xs text-green-400 mt-2">Certificate available</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardPage;
