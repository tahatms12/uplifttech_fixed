import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  trackCTA,
  trackError,
  trackFormAbandonment,
  trackPageView,
  trackScrollDepth,
  trackWebVital
} from '../../lib/analytics';

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

declare global {
  interface Window {
    webVitals?: {
      getCLS: (cb: (metric: { name: string; value: number }) => void) => void;
      getFID: (cb: (metric: { name: string; value: number }) => void) => void;
      getLCP: (cb: (metric: { name: string; value: number }) => void) => void;
    };
  }
}

const loadWebVitals = async () => {
  if (typeof window.webVitals !== 'undefined') {
    return;
  }
  await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/web-vitals@3/dist/web-vitals.iife.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Unable to load web-vitals library'));
    document.body.appendChild(script);
  });
};

const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (docHeight > 0) {
            const depth = Math.round((scrollTop / docHeight) * 100);
            trackScrollDepth(depth);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const ctaElement = target.closest<HTMLElement>('[data-analytics-cta]');
      if (ctaElement && ctaElement.getAttribute('data-analytics-manual') !== 'true') {
        const label = ctaElement.getAttribute('data-analytics-cta');
        if (label) {
          trackCTA(label);
        }
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      trackError(event.message);
    };
    window.addEventListener('error', handleGlobalError);
    return () => window.removeEventListener('error', handleGlobalError);
  }, []);

  useEffect(() => {
    loadWebVitals()
      .then(() => {
        window.webVitals?.getCLS(trackWebVital);
        window.webVitals?.getFID(trackWebVital);
        window.webVitals?.getLCP(trackWebVital);
      })
      .catch(() => {
        trackError('Web Vitals library failed to load');
      });
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        const activeForm = document.querySelector<HTMLFormElement>('form[data-analytics-form="active"]');
        if (activeForm) {
          const step = Number(activeForm.getAttribute('data-form-step') ?? 1);
          const name = activeForm.getAttribute('data-form-name') ?? 'unknown_form';
          trackFormAbandonment(name, step);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return <>{children}</>;
};

export default AnalyticsProvider;
