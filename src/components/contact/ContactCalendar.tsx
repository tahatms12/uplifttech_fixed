import React, { useEffect } from 'react';
import CalEmbed from '../calendar/CalEmbed';

interface ContactCalendarProps {
  className?: string;
}

const ContactCalendar: React.FC<ContactCalendarProps> = ({ className = '' }) => {
  useEffect(() => {
    // Load Cal.com script if not already loaded
    if (!document.querySelector('script[src="https://app.cal.com/embed/embed.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://app.cal.com/embed/embed.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div className={`glass-card p-6 ${className}`}>
      <h3 className="text-xl font-medium mb-4">Schedule a Meeting</h3>
      <CalEmbed 
        elementId="contact-calendar" 
        calLink="uplift-tech/30min"
        layout="week_view"
        style={{ height: '600px' }}
      />
    </div>
  );
};

export default ContactCalendar;