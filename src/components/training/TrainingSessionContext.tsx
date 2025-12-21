import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { trainingApi } from '../../lib/trainingApi';

export interface TrainingUser {
  id: string;
  email: string;
  full_name?: string;
  role?: string;
  is_admin?: boolean;
  isAdmin?: boolean;
}

interface TrainingSessionState {
  user: TrainingUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const TrainingSessionContext = createContext<TrainingSessionState | undefined>(undefined);

export const TrainingSessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<TrainingUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const res = await trainingApi.me();
    if (res.status === 200 && res.data && typeof (res.data as any).user === 'object') {
      const rawUser = (res.data as any).user as TrainingUser;
      setUser({
        ...rawUser,
        isAdmin: Boolean(rawUser.isAdmin ?? rawUser.is_admin),
      });
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  const logout = useCallback(async () => {
    await trainingApi.logout();
    setUser(null);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(() => ({ user, loading, refresh, logout }), [user, loading, refresh, logout]);

  return <TrainingSessionContext.Provider value={value}>{children}</TrainingSessionContext.Provider>;
};

export function useTrainingSession(): TrainingSessionState {
  const context = useContext(TrainingSessionContext);
  if (!context) {
    throw new Error('useTrainingSession must be used within TrainingSessionProvider');
  }
  return context;
}
