import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-brand-blue animate-spin" aria-hidden="true"></div>
        <div className="mt-4 text-sm text-white/80" role="status">Loading...</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;