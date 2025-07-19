import React from 'react';
import ZohoCalendar from '../components/ui/ZohoCalendar';

const ScheduleConsultationPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ZohoCalendar />
    </div>
  );
};

export default ScheduleConsultationPage;