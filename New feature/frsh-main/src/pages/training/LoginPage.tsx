import React, { useEffect, useState } from 'react';
import { login } from '../../lib/trainingApi';
import { useNavigate } from 'react-router-dom';
import { useTrainingUser } from '../../lib/useTrainingUser';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useTrainingUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      const m = document.createElement('meta');
      m.name = 'robots';
      m.content = 'noindex,nofollow';
      document.head.appendChild(m);
    } else {
      meta.content = 'noindex,nofollow';
    }
  }, []);

  useEffect(() => {
    if (user && !loading) navigate('/training/dashboard');
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await login(email, password);
      navigate('/training/dashboard');
    } catch (err) {
      setError('Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !user) {
    return <div className="max-w-xl mx-auto py-20 text-center text-white">Loading...</div>;
  }

  return (
    <div className="max-w-xl mx-auto py-20 px-4 text-white">
      <h1 className="text-3xl font-bold mb-4">Training Portal Login</h1>
      <p className="text-sm text-gray-300 mb-6">
        The portal records progress, lesson time, and quiz results for verification. Review our{' '}
        <a href="#privacy" className="text-indigo-300 underline">
          privacy notice
        </a>
        .
      </p>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm">
          <span>Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded border border-gray-600 bg-transparent px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span>Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded border border-gray-600 bg-transparent px-3 py-2"
          />
        </label>
        {error && <div className="text-red-400 text-sm" role="alert">{error}</div>}
        <button
          type="submit"
          disabled={submitting}
          className="btn bg-primary text-bg w-full flex items-center justify-center"
        >
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
