import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-neutral-700 border-t-electric-violet animate-spin"></div>
        <div className="mt-4 text-sm text-white/70">Loading...</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;