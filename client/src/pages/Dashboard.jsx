import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../lib/api';
import { useAuthStore } from '../store';

function Heatmap({ data }) {
  const weeks = [];
  const now = new Date();
  for (let w = 52; w >= 0; w--) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(now);
      date.setDate(date.getDate() - (w * 7 + (6 - d)));
      const key = date.toISOString().split('T')[0];
      const count = data[key] || 0;
      week.push({ date: key, count });
    }
    weeks.push(week);
  }

  const getColor = (count) => {
    if (count === 0) return 'bg-surface-lighter/30';
    if (count <= 2) return 'bg-green-900/50';
    if (count <= 4) return 'bg-green-700/60';
    if (count <= 6) return 'bg-green-500/70';
    return 'bg-green-400';
  };

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-[3px] min-w-fit">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((day, di) => (
              <div key={di} className={`w-3 h-3 rounded-sm ${getColor(day.count)} transition-colors hover:ring-1 hover:ring-primary cursor-pointer`}
                title={`${day.date}: ${day.count} submissions`} />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-3 text-xs text-text-secondary">
        <span>Less</span>
        {[0,2,4,6,8].map(c => <div key={c} className={`w-3 h-3 rounded-sm ${getColor(c)}`} />)}
        <span>More</span>
      </div>
    </div>
  );
}

function ProgressRing({ label, solved, total, color }) {
  const pct = total > 0 ? (solved / total) * 100 : 0;
  const radius = 30;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={radius} fill="none" stroke="currentColor" strokeWidth="4" className="text-surface-lighter/10" />
          <circle cx="40" cy="40" r={radius} fill="none" stroke={color} strokeWidth="4"
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-1000" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs font-black">{solved}/{total}</span>
          <span className="text-[8px] font-black opacity-40 uppercase tracking-tighter">{Math.round(pct)}%</span>
        </div>
      </div>
      <span className="text-[10px] font-bold text-text-secondary text-center uppercase tracking-widest">{label}</span>
    </div>
  );
}

export default function Dashboard() {
  const { user, updateUser } = useAuthStore();
  const [dashData, setDashData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const { data } = await api.get('/users/dashboard');
      setDashData(data);
      // Sync local user stats with real server data
      if (user) {
        updateUser({ ...user, ...data.stats });
      }
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

  const stats = dashData?.stats || {};
  const topicColors = ['#3b82f6','#06d6a0','#8b5cf6','#f59e0b','#ef4444','#ec4899','#14b8a6','#f97316','#6366f1','#84cc16','#06b6d4','#e11d48'];

  // For the topic rings, we need the analytics data which has topicProgress
  // We'll fetch analytics specifically if needed, or if we can get it from another endpoint
  // For now, let's use a default if not present or better yet, fetch it.
  
  return (
    <div className="min-h-screen pt-24 px-4 pb-12 bg-[#020617]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-12">
          <h1 className="text-5xl font-black mb-2 tracking-tight">MISSION <span className="gradient-text">CONTROL</span></h1>
          <div className="flex items-center gap-4 text-text-secondary text-sm">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-bold border border-primary/20">RANK: {stats.rank}</span>
            <span className="px-3 py-1 bg-accent/10 text-accent rounded-full font-bold border border-accent/20">LEVEL: {stats.badge}</span>
            <span className="opacity-50">ESTABLISHED: {new Date(user?.joinedAt).toLocaleDateString()}</span>
          </div>
        </motion.div>

        {/* Dynamic Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'SOLVED', value: stats.problemsSolved, sub: 'REAL-TIME', icon: '⚡', color: 'primary' },
            { label: 'STREAK', value: stats.streak, sub: 'DAYS ALIVE', icon: '🔥', color: 'accent' },
            { label: 'MASTERY', value: stats.topicsMastered, sub: 'TOPICS', icon: '🧠', color: 'green-500' },
            { label: 'PERCENTILE', value: 'Top 5%', sub: 'WORLDWIDE', icon: '🌎', color: 'yellow-500' },
          ].map((stat, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.1 }}
              key={i} 
              className="glass p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group hover:border-primary/30 transition-all duration-500"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-all" />
              <div className="flex justify-between items-start mb-6">
                <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">{stat.icon}</span>
                <span className="text-[10px] font-black tracking-widest text-text-secondary opacity-40 uppercase">{stat.sub}</span>
              </div>
              <div className="text-4xl font-black mb-1">{stat.value}</div>
              <div className="text-xs font-bold text-text-secondary uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Heatmap & Activity */}
          <div className="lg:col-span-8 space-y-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-[2rem] p-10 border border-white/5">
              <header className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-black tracking-widest uppercase opacity-80">Activity Grid</h2>
                <div className="flex gap-4 text-[10px] font-bold text-text-secondary opacity-40">
                  <span>CONSISTENCY: 94%</span>
                  <span>TOTAL XP: 12,450</span>
                </div>
              </header>
              {dashData?.heatmap && <Heatmap data={dashData.heatmap} />}
            </motion.div>

            {/* Recent Grid */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-[2rem] p-10 border border-white/5">
              <h2 className="text-xl font-black tracking-widest uppercase opacity-80 mb-8 font-mono">Terminal Output</h2>
              <div className="space-y-4">
                {dashData?.recentSubmissions?.length > 0 ? dashData.recentSubmissions.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${s.status === 'Accepted' ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500'}`} />
                      <div>
                        <p className="text-sm font-bold font-mono tracking-tight">{s.problem}</p>
                        <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest opacity-60 m-0">{s.time} • {s.language}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest ${
                      s.status === 'Accepted' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                    }`}>{s.status}</span>
                  </div>
                )) : (
                  <div className="text-center py-12 text-text-secondary italic opacity-50">No recent activity detected in logic core.</div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Side Panel: Recommendations */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-[2rem] p-8 border border-white/5">
              <h2 className="text-sm font-black tracking-[0.2em] uppercase opacity-40 mb-8">Neural Suggestions</h2>
              <div className="space-y-4">
                {dashData?.recommended?.map(p => (
                  <Link key={p.id} to={`/problems/${p.id}`} className="block p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/50 transition-all group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-1 y-full bg-primary opacity-0 group-hover:opacity-100 transition-all" />
                    <p className="text-sm font-black mb-3">{p.title}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-text-secondary opacity-60 underline underline-offset-4 decoration-primary/30 uppercase tracking-widest">{p.topic}</span>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${
                        p.difficulty === 'Easy' ? 'border-green-500/30 text-green-500' : p.difficulty === 'Medium' ? 'border-yellow-500/30 text-yellow-500' : 'border-red-500/30 text-red-500'
                      }`}>{p.difficulty}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
