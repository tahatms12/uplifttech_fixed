import React, { useEffect } from 'react';

interface CalEmbedProps {
  elementId: string;
  calLink: string;
  namespace?: string;
  layout?: 'month_view' | 'week_view' | 'day_view';
  hideEventTypeDetails?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

declare global {
  interface Window {
    Cal?: {
      (action: string, ...args: any[]): void;
      ns?: Record<string, (action: string, ...args: any[]) => void>;
    };
  }
}

const CalEmbed: React.FC<CalEmbedProps> = ({
  elementId,
  calLink,
  namespace = '30min',
  layout = 'week_view',
  hideEventTypeDetails = false,
  className = '',
  style = {}
}) => {
  useEffect(() => {
    // Make sure Cal.com script is loaded
    const loadCalScript = () => {
      if (!document.querySelector('script[src="https://app.cal.com/embed/embed.js"]')) {
        const script = document.createElement('script');
        script.src = 'https://app.cal.com/embed/embed.js';
        script.async = true;
        document.head.appendChild(script);
        
        // Initialize when loaded
        script.onload = () => {
          if (window.Cal) {
            initializeCalendar();
          }
        };
      } else if (window.Cal) {
        // Script already loaded
        initializeCalendar();
      }
    };

    // Initialize the calendar
    const initializeCalendar = () => {
      if (!window.Cal) return;
      
      // Initialize Cal.com with namespace if needed
      if (!window.Cal.ns || !window.Cal.ns[namespace]) {
        window.Cal('init', namespace, { origin: "https://cal.com" });
      }

      // Configure inline calendar
      setTimeout(() => {
        if (window.Cal.ns && window.Cal.ns[namespace]) {
          window.Cal.ns[namespace]('inline', {
            elementOrSelector: `#${elementId}`,
            calLink: calLink,
            config: { layout }
          });
          
          window.Cal.ns[namespace]('ui', {
            hideEventTypeDetails: hideEventTypeDetails,
            layout: layout
          });
        }
      }, 100); // Small delay to ensure Cal.com is ready
    };

    // Initial load
    loadCalScript();
    
    // Cleanup
    return () => {
      // Cal.com doesn't provide a direct cleanup method
      // The element's contents will be removed when component unmounts
    };
  }, [elementId, calLink, namespace, layout, hideEventTypeDetails]);

  return (
    <div 
      id={elementId} 
      className={className}
      style={{
        width: '100%',
        height: '700px',
        overflow: 'hidden',
        borderRadius: '0.75rem',
        ...style
      }}
    />
  );
};

export default CalEmbed;