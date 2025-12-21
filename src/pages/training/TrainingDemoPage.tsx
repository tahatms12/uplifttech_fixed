import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TrainingNoIndexHelmet from '../../components/training/TrainingNoIndexHelmet';
import { useTrainingSession } from '../../components/training/TrainingSessionContext';
import { trainingApi } from '../../lib/trainingApi';

const TrainingDemoPage: React.FC = () => {
  const navigate = useNavigate();
  const { refresh } = useTrainingSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const startDemo = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await trainingApi.demoLogin();
    if (res.status === 200) {
      await refresh();
      navigate('/training/dashboard', { replace: true });
      return;
    }
    const message =
      typeof (res.data as any)?.message === 'string'
        ? (res.data as any).message
        : res.error || 'Unable to start the demo. Please try again.';
    setError(message);
    setLoading(false);
  }, [navigate, refresh]);

  useEffect(() => {
    void startDemo();
  }, [startDemo]);

  return (
    <div className="space-y-4">
      <TrainingNoIndexHelmet />
      <h2 className="text-2xl font-bold">Launching demo</h2>
      <p className="text-sm text-gray-300">
        Setting up your demo session now.
      </p>
      {loading ? (
        <p className="text-sm text-gray-300">Connecting to the training portal...</p>
      ) : null}
      {error ? (
        <div className="space-y-3" role="alert">
          <p className="text-sm text-red-400">{error}</p>
          <button
            type="button"
            onClick={startDemo}
            className="px-4 py-2 bg-green-600 text-white rounded focus-visible:ring-2 focus-visible:ring-green-400 hover:bg-green-700 transition-colors"
          >
            Try again
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default TrainingDemoPage;
