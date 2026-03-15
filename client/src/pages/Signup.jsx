import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store';
import api from '../lib/api';

export default function Signup() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/signup', { username: form.username, email: form.email, password: form.password });
      login(data.user, data.accessToken);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
        <div className="glass rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">DS</div>
            <h1 className="text-2xl font-bold">Create your account</h1>
            <p className="text-text-secondary text-sm mt-1">Start your DSA journey today</p>
          </div>
          {error && <div className="mb-4 p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-text-secondary">Username</label>
              <input type="text" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required
                className="w-full px-4 py-2.5 rounded-lg bg-surface-light border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-text-secondary">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required
                className="w-full px-4 py-2.5 rounded-lg bg-surface-light border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-text-secondary">Password</label>
              <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required
                className="w-full px-4 py-2.5 rounded-lg bg-surface-light border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-text-secondary">Confirm Password</label>
              <input type="password" value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})} required
                className="w-full px-4 py-2.5 rounded-lg bg-surface-light border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-50">
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
          <p className="text-center text-sm text-text-secondary mt-6">
            Already have an account? <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
