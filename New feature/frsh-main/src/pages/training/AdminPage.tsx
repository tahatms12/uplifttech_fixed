import React, { useEffect, useState } from 'react';
import { fetchAdminExport, fetchAdminUserProgress, fetchAdminUsers } from '../../lib/trainingApi';
import { useTrainingUser } from '../../lib/useTrainingUser';
import { useNavigate } from 'react-router-dom';

const AdminPage: React.FC = () => {
  const { user, loading } = useTrainingUser();
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [error, setError] = useState('');

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
      fetchAdminUsers()
        .then((res) => setUsers(res.users))
        .catch(() => setError('Unable to load users'));
    }
  }, [user]);

  const loadProgress = async (id: string) => {
    const res = await fetchAdminUserProgress(id);
    setProgress(res);
    setSelected(users.find((u) => u.id === id));
  };

  const exportCsv = async () => {
    const data = await fetchAdminExport();
    const blob = new Blob([data], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'training-progress.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 text-white">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Training Admin</h1>
        <button className="btn bg-primary text-bg" onClick={exportCsv}>
          Export CSV
        </button>
      </div>
      {error && <div className="text-red-400 mb-4">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 space-y-2">
          <h2 className="text-lg font-semibold">Users</h2>
          {users.map((u) => (
            <button
              key={u.id}
              className="w-full text-left p-2 border border-gray-700 rounded"
              onClick={() => loadProgress(u.id)}
            >
              <div className="font-semibold">{u.full_name}</div>
              <div className="text-xs text-gray-400">{u.email}</div>
            </button>
          ))}
        </div>
        <div className="md:col-span-2">
          {selected ? (
            <div className="border border-gray-700 rounded p-4">
              <h3 className="text-xl font-semibold mb-2">{selected.full_name}</h3>
              <p className="text-sm text-gray-300 mb-4">{selected.email}</p>
              <h4 className="text-lg font-semibold">Completions</h4>
              <ul className="list-disc ml-5 text-sm text-gray-300">
                {progress?.completions?.map((c: any) => (
                  <li key={c.id}>
                    {c.course_id} – {c.completed_at}
                  </li>
                )) || <li>None</li>}
              </ul>
              <h4 className="text-lg font-semibold mt-4">Quiz Attempts</h4>
              <ul className="list-disc ml-5 text-sm text-gray-300">
                {progress?.quizzes?.map((q: any) => (
                  <li key={q.id}>
                    {q.quiz_id}: {q.score_percent}% ({q.passed ? 'passed' : 'not passed'})
                  </li>
                )) || <li>None</li>}
              </ul>
            </div>
          ) : (
            <div className="text-gray-400">Select a user to view progress.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
