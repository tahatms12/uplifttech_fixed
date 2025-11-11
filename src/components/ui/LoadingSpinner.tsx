import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="relative">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-border-muted/40 border-t-electric-violet" aria-hidden="true"></div>
        <div className="mt-4 text-sm text-text-muted" role="status">Loading...</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;