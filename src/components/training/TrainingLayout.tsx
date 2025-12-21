import { Outlet, Link, useNavigate } from 'react-router-dom';
import TrainingNoIndexHelmet from './TrainingNoIndexHelmet';
import { TrainingSessionProvider, useTrainingSession } from './TrainingSessionContext';

const TrainingLayoutContent = () => {
  const { user, loading, logout } = useTrainingSession();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/training');
  };

  return (
    <div className="min-h-screen bg-rich-black text-white">
      <TrainingNoIndexHelmet />
      <div className="container-custom mx-auto px-4 py-8">
        <header className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Training Portal</h1>
              <p className="text-sm text-gray-300">Employee training workspace with progress tracking.</p>
            </div>
            <div className="text-sm text-gray-300 space-y-1">
              {loading ? (
                <span>Checking session...</span>
              ) : user ? (
                <div className="flex flex-col items-end gap-2">
                  <div>
                    Signed in as <span className="text-white">{user.full_name || user.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {user.is_admin ? (
                      <Link to="/training/admin" className="text-indigo-300 underline">
                        Admin
                      </Link>
                    ) : null}
                    <button
                      type="button"
                      className="px-3 py-1 rounded bg-gray-800 border border-gray-700 text-gray-100"
                      onClick={handleLogout}
                    >
                      Log out
                    </button>
                  </div>
                </div>
              ) : (
                <span>Not signed in</span>
              )}
            </div>
          </div>
        </header>
        <main className="bg-gray-900 rounded-lg shadow-lg p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const TrainingLayout = () => (
  <TrainingSessionProvider>
    <TrainingLayoutContent />
  </TrainingSessionProvider>
);

export default TrainingLayout;
