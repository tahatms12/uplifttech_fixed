import React from 'react';

interface TrainingErrorBoundaryProps {
  children: React.ReactNode;
}

interface TrainingErrorBoundaryState {
  hasError: boolean;
}

class TrainingErrorBoundary extends React.Component<TrainingErrorBoundaryProps, TrainingErrorBoundaryState> {
  state: TrainingErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Training error boundary', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-gray-800 p-6 rounded text-gray-100">
          <h2 className="text-xl font-semibold">We hit a training portal error</h2>
          <p className="text-sm text-gray-300 mt-2">
            Refresh the page to continue. If the issue persists, contact your training coordinator.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default TrainingErrorBoundary;
