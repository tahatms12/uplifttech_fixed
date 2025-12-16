import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TrainingNoIndexHelmet from '../../components/training/TrainingNoIndexHelmet';
import { trainingApi } from '../../lib/trainingApi';

const TrainingEntryPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    trainingApi.me().then((res) => {
      if (res.status === 200 && res.data) {
        setAuthenticated(true);
        navigate('/training/dashboard');
      } else {
        setAuthenticated(false);
      }
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await trainingApi.login({ email, password });
    if (res.status === 200) {
      navigate('/training/dashboard');
    }
  };

  if (authenticated === null) return <div className="text-gray-200">Loading...</div>;

  return (
    <div className="space-y-4">
      <TrainingNoIndexHelmet />
      <h2 className="text-2xl font-bold">Training Access</h2>
      <p className="text-sm text-gray-300">
        This private training portal records your progress, time spent in lessons, and quiz results to help managers understand completion. See our
        <a href="/privacy" className="text-indigo-400 underline ml-1">privacy policy</a> for details.
      </p>
      <form className="space-y-3" onSubmit={submit}>
        <div>
          <label className="block text-sm">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 rounded bg-gray-800 border border-gray-700" />
        </div>
        <div>
          <label className="block text-sm">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 rounded bg-gray-800 border border-gray-700" />
        </div>
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded focus-visible:ring-2 focus-visible:ring-indigo-400">
          Log in
        </button>
      </form>
    </div>
  );
};

export default TrainingEntryPage;
