import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../lib/api';

export default function Compete() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    try {
      const { data } = await api.get('/contests');
      setContests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen pt-20 flex justify-center items-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const upcoming = contests.filter(c => c.status === 'upcoming');
  const past = contests.filter(c => c.status === 'completed');

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 pl-4">
          <h1 className="text-3xl font-bold mb-2">🏆 Contests</h1>
          <p className="text-text-secondary">Compete with others and improve your rating</p>
        </motion.div>

        {/* Hero Contest */}
        {upcoming[0] && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-8 mb-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-4 border border-primary/30">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" /> Next Contest
                </div>
                <h2 className="text-3xl font-bold mb-2">{upcoming[0].title}</h2>
                <p className="text-text-secondary max-w-lg mb-6">{upcoming[0].description}</p>
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📅</span> {new Date(upcoming[0].startTime).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⏱</span> {upcoming[0].duration} mins
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">👥</span> {upcoming[0].participants} Registered
                  </div>
                </div>
              </div>
              <button disabled
                className="px-8 py-4 bg-surface-lighter/50 rounded-xl font-bold text-center border border-border/50 whitespace-nowrap opacity-75 cursor-not-allowed">
                Starts in 2 Days
              </button>
            </div>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 border-b border-border/30 mb-6">
          {['upcoming', 'past'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium capitalize transition-colors relative ${
                activeTab === tab ? 'text-primary' : 'text-text-secondary hover:text-text'
              }`}>
              {tab} Contests
              {activeTab === tab && <motion.div layoutId="competeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
            </button>
          ))}
        </div>

        {/* Contest List */}
        <div className="grid gap-4">
          {(activeTab === 'upcoming' ? upcoming : past).map((contest, i) => (
            <motion.div key={contest.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass rounded-xl p-5 hover:border-primary/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold mb-1">{contest.title}</h3>
                <p className="text-sm text-text-secondary mb-3">{contest.description}</p>
                <div className="flex items-center gap-4 text-xs text-text-secondary">
                  <span>📅 {new Date(contest.startTime).toLocaleDateString()}</span>
                  <span>⏱ {contest.duration}m</span>
                  <span>👥 {contest.participants}</span>
                </div>
              </div>
              <Link to="/problems"
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold text-center transition-colors whitespace-nowrap ${
                  contest.status === 'upcoming'
                    ? 'bg-surface-lighter text-text-secondary hover:bg-surface-lighter/80'
                    : 'bg-primary/10 text-primary hover:bg-primary/20'
                }`}>
                {contest.status === 'upcoming' ? 'Register' : 'Practice Problems →'}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
