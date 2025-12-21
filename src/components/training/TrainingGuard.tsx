import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTrainingSession } from './TrainingSessionContext';

interface TrainingGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const TrainingGuard: React.FC<TrainingGuardProps> = ({ children, requireAdmin = false }) => {
  const { user, loading } = useTrainingSession();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/training', { replace: true, state: { from: location.pathname } });
    }
  }, [loading, user, navigate, location.pathname]);

  if (loading) return <div className="text-gray-200">Loading...</div>;
  if (!user) return null;

  if (requireAdmin && !user.is_admin) {
    return (
      <div className="space-y-3 text-gray-200">
        <h2 className="text-xl font-semibold">Admin access required</h2>
        <p>You do not have permission to view this page.</p>
        <Link to="/training/dashboard" className="text-indigo-300 underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  return <>{children}</>;
};

export default TrainingGuard;
