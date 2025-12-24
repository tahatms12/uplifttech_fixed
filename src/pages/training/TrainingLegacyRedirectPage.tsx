import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

const TrainingLegacyRedirectPage: React.FC = () => {
  const { courseId, lessonId } = useParams();
  if (courseId && lessonId) {
    return <Navigate to={`/training/course/${courseId}/learn/${lessonId}`} replace />;
  }
  if (courseId) {
    return <Navigate to={`/training/course/${courseId}`} replace />;
  }
  return <Navigate to="/training/dashboard" replace />;
};

export default TrainingLegacyRedirectPage;
