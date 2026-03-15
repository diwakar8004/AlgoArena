import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore, useThemeStore } from '../../store';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { to: '/problems', label: 'Problems' },
  { to: '/roadmap', label: 'Roadmap' },
  { to: '/compete', label: 'Compete' },
  { to: '/leaderboard', label: 'Leaderboard' },
];

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setProfileOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-white text-sm">
              DS
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:block">
              AlgoArena
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.to
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-secondary hover:text-text hover:bg-surface-lighter/50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-surface-lighter/50 transition-colors text-text-secondary hover:text-text"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              )}
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-surface-lighter/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:block text-sm font-medium">{user?.username}</span>
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-56 glass rounded-xl shadow-2xl border border-border/50 py-2 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-border/50">
                        <p className="text-sm font-medium">{user?.username}</p>
                        <p className="text-xs text-text-secondary">{user?.email}</p>
                      </div>
                      <Link to="/dashboard" onClick={() => setProfileOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-surface-lighter/50 transition-colors">📊 Dashboard</Link>
                      <Link to="/analytics" onClick={() => setProfileOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-surface-lighter/50 transition-colors">📈 Analytics</Link>
                      <Link to={`/profile/${user?.username}`} onClick={() => setProfileOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-surface-lighter/50 transition-colors">👤 Profile</Link>
                      {user?.role === 'admin' && (
                        <Link to="/admin" onClick={() => setProfileOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-surface-lighter/50 transition-colors border-t border-border/30 mt-1 pt-2 text-accent font-bold">🛠 Admin Panel</Link>
                      )}
                      <div className="border-t border-border/50 mt-1 pt-1">
                        <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 text-sm text-danger hover:bg-surface-lighter/50 transition-colors">🚪 Logout</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text transition-colors">
                  Log in
                </Link>
                <Link to="/signup" className="px-4 py-2 text-sm font-medium bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors">
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-surface-lighter/50"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden glass border-t border-border/30"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-2.5 rounded-lg text-sm font-medium ${
                    location.pathname === link.to ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:text-text'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated && user?.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2.5 rounded-lg text-sm font-bold text-accent"
                >
                  🛠 Admin Panel
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
