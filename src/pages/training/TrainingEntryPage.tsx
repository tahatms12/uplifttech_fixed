import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TrainingNoIndexHelmet from '../../components/training/TrainingNoIndexHelmet';
import { trainingApi } from '../../lib/trainingApi';

const TrainingEntryPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    trainingApi.me()
      .then((res) => {
        if (res.status === 200 && res.data) {
          navigate('/training/dashboard');
        } else {
          // not authenticated
        }
      })
      .catch(() => {
        // Silently handle API errors (no backend yet)
      });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await trainingApi.login({ username, password });
    
    if (res.status === 200) {
      navigate('/training/dashboard');
      return;
    }

    const data = (res.data || {}) as Record<string, any>;
    if (res.status === 401) {
      if (data.code === 'INVALID_USERNAME') {
        setError('Username is incorrect');
        return;
      }
      if (data.code === 'INVALID_PASSWORD') {
        setError('Password is incorrect');
        return;
      }
    }
    if (typeof data.message === 'string' && data.message.trim()) {
      setError(data.message);
      return;
    }
    setError('Login failed. Try again.');
  };

  const handleTakeDemo = () => {
    navigate('/training/demo');
  };

  // Removed loading check so page renders immediately

  return (
    <div className="space-y-4">
      <TrainingNoIndexHelmet />
      <h2 className="text-2xl font-bold">Training Access</h2>
      <p className="text-sm text-gray-300">
        This private training portal records your progress, time spent in lessons, and quiz results to help managers understand completion. See our
        <Link to="/privacy" className="text-indigo-400 underline ml-1">privacy policy</Link> for details.
      </p>
      <p className="text-xs text-amber-300">
        Completion of training does not constitute HIPAA certification. Training content uses fictional or de-identified examples only—do not enter
        real PHI in any responses.
      </p>
      <form className="space-y-3" onSubmit={submit}>
        <div>
          <label className="block text-sm">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          />
        </div>
        <div>
          <label className="block text-sm">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 rounded bg-gray-800 border border-gray-700" />
        </div>
        <div className="flex gap-3">
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded focus-visible:ring-2 focus-visible:ring-indigo-400 hover:bg-indigo-700 transition-colors">
            Log in
          </button>
          <button type="button" onClick={handleTakeDemo} className="px-4 py-2 bg-green-600 text-white rounded focus-visible:ring-2 focus-visible:ring-green-400 hover:bg-green-700 transition-colors">
            Take Demo
          </button>
        </div>
        {error ? <p className="text-sm text-red-400" role="alert">{error}</p> : null}
      </form>
    </div>
  );
};

export default TrainingEntryPage;
