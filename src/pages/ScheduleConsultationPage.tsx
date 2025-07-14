import React from 'react';

const ScheduleConsultationPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <iframe src="/.netlify/functions/zoho-calendar" title="taha"frameBorder="0" scrolling="no" marginWidth="0" border="0px" marginHeight="0"height="350px" width="432px" allowTransparency="true" align="center"></iframe>
    </div>
  );
};

export default ScheduleConsultationPage;