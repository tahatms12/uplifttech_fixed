import { useEffect, useState } from 'react';
import { useTrainingSession } from '../components/training/TrainingSessionContext';

const STORAGE_KEY = 'training-role-selection';

export function useTrainingRole() {
  const { user } = useTrainingSession();
  const [role, setRoleState] = useState<string>('');

  useEffect(() => {
    if (user?.role) {
      setRoleState(user.role);
      return;
    }
    const stored = window.localStorage.getItem(STORAGE_KEY) || '';
    setRoleState(stored);
  }, [user?.role]);

  const setRole = (nextRole: string) => {
    setRoleState(nextRole);
    window.localStorage.setItem(STORAGE_KEY, nextRole);
  };

  return { role, setRole };
}
