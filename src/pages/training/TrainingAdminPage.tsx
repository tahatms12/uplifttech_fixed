import React, { useEffect, useState } from 'react';
import TrainingNoIndexHelmet from '../../components/training/TrainingNoIndexHelmet';
import { trainingApi } from '../../lib/trainingApi';
import curriculum from '../../data/training/exports/curriculum.generated.json';

const TrainingAdminPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    trainingApi.adminUsers().then((res) => {
      if (res.status === 200 && res.data) {
        const payload = res.data as { users?: any[] } | any[];
        if (Array.isArray(payload)) {
          setUsers(payload);
        } else {
          setUsers(payload.users || []);
        }
      } else if (res.status === 401 || res.status === 403) {
        setError('Unauthorized');
      }
    });
  }, []);

  const loadProgress = async (id: string) => {
    const res = await trainingApi.adminUserProgress(id);
    if (res.status === 200) {
      setSelected({ id, progress: res.data });
    }
  };

  return (
    <div className="space-y-4">
      <TrainingNoIndexHelmet />
      <h2 className="text-2xl font-bold">Training Admin</h2>
      <div className="text-xs text-gray-400">
        Curriculum version: {(curriculum as any).curriculumVersion || 'Not specified'} • Generated at:{' '}
        {(curriculum as any).generatedAt || 'Not specified'}
      </div>
      {error && <div className="text-red-400">{error}</div>}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <h3 className="font-semibold mb-2">Users</h3>
          <ul className="space-y-2">
            {users.map((user) => (
              <li key={user.id} className="flex justify-between items-center bg-gray-800 p-2 rounded">
                <span>{user.email || user.id}</span>
                <button className="text-sm text-indigo-300" onClick={() => loadProgress(user.id)}>
                  View
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-2 bg-gray-800 p-3 rounded">
          <h3 className="font-semibold mb-2">User progress</h3>
          {selected ? <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(selected.progress, null, 2)}</pre> : <p className="text-gray-300">Select a user to view details.</p>}
          <div className="mt-3">
            <a
              className="px-3 py-2 bg-indigo-600 text-white rounded"
              href="/api/training/admin/export.csv"
            >
              Export CSV
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingAdminPage;
