import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../lib/api';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data } = await api.get('/leaderboard');
      setLeaderboard(data);
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

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">🌍 Global Leaderboard</h1>
          <p className="text-text-secondary">Top performing developers on AlgoArena</p>
        </motion.div>

        {/* Top 3 Podium */}
        <div className="flex flex-col sm:flex-row items-end justify-center gap-4 sm:gap-8 mb-12 mt-16 px-4">
          {/* Rank 2 */}
          {leaderboard[1] && (
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="w-full sm:w-1/3 flex flex-col items-center order-2 sm:order-1">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white text-xl font-bold border-4 border-surface shadow-[0_0_20px_rgba(156,163,175,0.4)] z-10 -mb-8">
                {leaderboard[1].username[0].toUpperCase()}
              </div>
              <div className="w-full bg-surface-light border border-gray-400/30 rounded-t-2xl pt-10 pb-4 text-center">
                <div className="text-2xl mb-1">🥈</div>
                <Link to={`/profile/${leaderboard[1].username}`} className="font-bold hover:text-primary transition-colors">{leaderboard[1].username}</Link>
                <div className="text-sm font-medium text-text-secondary mt-1">{leaderboard[1].contestRating} CR</div>
                <div className="text-xs text-text-secondary mt-1">{leaderboard[1].problemsSolved} Solved</div>
              </div>
            </motion.div>
          )}

          {/* Rank 1 */}
          {leaderboard[0] && (
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="w-full sm:w-1/3 flex flex-col items-center order-1 sm:order-2">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white text-2xl font-bold border-4 border-surface shadow-[0_0_30px_rgba(250,204,21,0.5)] z-10 -mb-10">
                {leaderboard[0].username[0].toUpperCase()}
              </div>
              <div className="w-full bg-gradient-to-b from-yellow-500/20 to-surface-light border border-yellow-500/30 rounded-t-2xl pt-12 pb-6 text-center transform sm:-translate-y-4">
                <div className="text-3xl mb-1 mt-1">👑</div>
                <Link to={`/profile/${leaderboard[0].username}`} className="text-lg font-extrabold text-yellow-500 hover:text-yellow-400 transition-colors drop-shadow-md">{leaderboard[0].username}</Link>
                <div className="text-sm font-bold text-text-secondary mt-1">{leaderboard[0].contestRating} CR</div>
                <div className="text-xs font-semibold text-text-secondary mt-1">{leaderboard[0].problemsSolved} Solved</div>
              </div>
            </motion.div>
          )}

          {/* Rank 3 */}
          {leaderboard[2] && (
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="w-full sm:w-1/3 flex flex-col items-center order-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-white text-xl font-bold border-4 border-surface shadow-[0_0_20px_rgba(217,119,6,0.4)] z-10 -mb-8">
                {leaderboard[2].username[0].toUpperCase()}
              </div>
              <div className="w-full bg-surface-light border border-orange-500/30 rounded-t-2xl pt-10 pb-4 text-center transform sm:translate-y-4">
                <div className="text-2xl mb-1">🥉</div>
                <Link to={`/profile/${leaderboard[2].username}`} className="font-bold text-orange-500 hover:text-orange-400 transition-colors">{leaderboard[2].username}</Link>
                <div className="text-sm font-medium text-text-secondary mt-1">{leaderboard[2].contestRating} CR</div>
                <div className="text-xs text-text-secondary mt-1">{leaderboard[2].problemsSolved} Solved</div>
              </div>
            </motion.div>
          )}
        </div>

        {/* List */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="glass rounded-xl overflow-hidden mt-8">
          <table className="w-full text-left">
            <thead className="bg-surface-lighter/50 border-b border-border/30">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider w-16 text-center">Rank</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right">Rating</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right hidden sm:table-cell">Solved</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right hidden md:table-cell">Streak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {leaderboard.slice(3).map((user, i) => (
                <tr key={user.username} className="hover:bg-surface-lighter/30 transition-colors group">
                  <td className="px-6 py-4 text-center text-sm font-medium text-text-secondary">{user.rank}</td>
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/50 to-accent/50 flex items-center justify-center text-xs font-bold">
                      {user.username[0].toUpperCase()}
                    </div>
                    <Link to={`/profile/${user.username}`} className="font-medium group-hover:text-primary transition-colors">
                      {user.username}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-primary">{user.contestRating}</td>
                  <td className="px-6 py-4 text-right text-sm text-text-secondary hidden sm:table-cell">{user.problemsSolved}</td>
                  <td className="px-6 py-4 text-right text-sm text-text-secondary hidden md:table-cell flex items-center justify-end gap-1">
                    {user.streak} <span className="text-orange-500">🔥</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </div>
  );
}
