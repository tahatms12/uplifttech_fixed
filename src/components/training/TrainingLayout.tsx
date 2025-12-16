import { Outlet } from 'react-router-dom';
import TrainingNoIndexHelmet from './TrainingNoIndexHelmet';

const TrainingLayout = () => {
  return (
    <div className="min-h-screen bg-rich-black text-white">
      <TrainingNoIndexHelmet />
      <div className="container-custom mx-auto px-4 py-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">Training Portal</h1>
          <p className="text-sm text-gray-300">Employee training workspace with progress tracking.</p>
        </header>
        <main className="bg-gray-900 rounded-lg shadow-lg p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TrainingLayout;
