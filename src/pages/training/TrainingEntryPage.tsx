const TrainingEntryPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Remove the useEffect that calls trainingApi.me()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Mock validation or just navigate directly
    if (username && password) {
      navigate('/training/dashboard');
    } else {
      setError('Please enter username and password');
    }
  };

  const handleTakeDemo = () => {
    navigate('/training/dashboard');
  };

  return (
    <div className="space-y-4">
      <TrainingNoIndexHelmet />
      <h2 className="text-2xl font-bold">Training Access</h2>
      <p className="text-sm text-gray-300">
        This private training portal records your progress, time spent in lessons, and quiz results to help managers understand completion. See our
        <a href="/privacy" className="text-indigo-400 underline ml-1">privacy policy</a> for details.
      </p>
      <form className="space-y-3" onSubmit={submit}>
        <div>
          <label className="block text-sm">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          />
        </div>
        <div>
          <label className="block text-sm">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 rounded bg-gray-800 border border-gray-700" />
        </div>
        <div className="flex gap-3">
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded focus-visible:ring-2 focus-visible:ring-indigo-400 hover:bg-indigo-700 transition-colors">
            Log in
          </button>
          <button type="button" onClick={handleTakeDemo} className="px-4 py-2 bg-green-600 text-white rounded focus-visible:ring-2 focus-visible:ring-green-400 hover:bg-green-700 transition-colors">
            Take Demo
          </button>
        </div>
        {error ? <p className="text-sm text-red-400" role="alert">{error}</p> : null}
      </form>
    </div>
  );
};
