import { useEffect, useState } from 'react';
import { currentUser } from './trainingApi';

export function useTrainingUser() {
  const [user, setUser] = useState<{ id: string; email: string; role: string; full_name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    currentUser()
      .then((res) => {
        if (!active) return;
        setUser(res.user);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
    return () => {
      active = false;
    };
  }, []);
  return { user, loading, setUser };
}
