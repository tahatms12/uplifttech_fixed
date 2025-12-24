import { useCallback, useEffect, useState } from 'react';
import { progressService, TrainingProgressState } from './ProgressService';

export const useTrainingProgressState = () => {
  const [state, setState] = useState<TrainingProgressState>(() => progressService.load());

  const refresh = useCallback(() => {
    setState(progressService.load());
  }, []);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'training-progress-v2') {
        refresh();
      }
    };
    const handleProgressUpdate = () => refresh();
    window.addEventListener('storage', handleStorage);
    window.addEventListener('training-progress-updated', handleProgressUpdate);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('training-progress-updated', handleProgressUpdate);
    };
  }, [refresh]);

  return { state, refresh };
};
