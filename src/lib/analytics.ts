export type AnalyticsEvent = {
  action: string;
  category: string;
  label?: string;
  value?: number;
};

const isBrowser = typeof window !== 'undefined';

export const trackEvent = ({ action, category, label, value }: AnalyticsEvent) => {
  if (!isBrowser || typeof window.gtag !== 'function') {
    return;
  }
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value
  });
};

export const trackPageView = (path: string) => {
  if (!isBrowser || typeof window.gtag !== 'function') {
    return;
  }
  window.gtag('event', 'page_view', {
    page_path: path
  });
};

export const trackScrollDepth = (() => {
  const thresholds = [25, 50, 75, 100];
  const reached = new Set<number>();

  return (depth: number) => {
    thresholds.forEach((threshold) => {
      if (depth >= threshold && !reached.has(threshold)) {
        reached.add(threshold);
        trackEvent({
          action: 'scroll_depth',
          category: 'engagement',
          label: `${threshold}%`
        });
      }
    });
  };
})();

export const trackFormSubmission = (formName: string) =>
  trackEvent({ action: 'form_submit', category: 'conversions', label: formName });

export const trackFormAbandonment = (formName: string, step: number) =>
  trackEvent({ action: 'form_abandon', category: 'conversions', label: `${formName} - step ${step}` });

export const trackCTA = (label: string) =>
  trackEvent({ action: 'cta_click', category: 'engagement', label });

export const trackError = (label: string) =>
  trackEvent({ action: 'error', category: 'system', label });

export const trackWebVital = (metric: { name: string; value: number }) =>
  trackEvent({ action: metric.name, category: 'web_vitals', value: Math.round(metric.value) });

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
