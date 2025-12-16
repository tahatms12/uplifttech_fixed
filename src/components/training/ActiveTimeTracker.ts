import { useEffect, useRef } from 'react';
import { trainingApi } from '../../lib/trainingApi';

export interface ActiveTimeTrackerOptions {
  courseId: string;
  stepId: string;
}

export function useActiveTimeTracker({ courseId, stepId }: ActiveTimeTrackerOptions) {
  const lastHeartbeat = useRef<number>(Date.now());
  const idleTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    const sendHeartbeat = async () => {
      const now = Date.now();
      if (document.hidden) return;
      if (now - lastHeartbeat.current >= 15000) {
        lastHeartbeat.current = now;
        await trainingApi.events({ type: 'heartbeat', courseId, stepId, at: new Date().toISOString() });
      }
    };

    const handleActivity = () => {
      lastHeartbeat.current = Date.now();
      if (idleTimeout.current) clearTimeout(idleTimeout.current);
      idleTimeout.current = setTimeout(() => {
        lastHeartbeat.current = 0;
      }, 60000);
    };

    interval = setInterval(sendHeartbeat, 5000);
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    document.addEventListener('visibilitychange', sendHeartbeat);

    return () => {
      if (interval) clearInterval(interval);
      if (idleTimeout.current) clearTimeout(idleTimeout.current);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      document.removeEventListener('visibilitychange', sendHeartbeat);
    };
  }, [courseId, stepId]);
}
