import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import api from '../lib/api';

const COLORS = ['#3b82f6', '#06d6a0', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899'];

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/users/analytics');
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex justify-center items-center bg-[#020617]">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  // Fallback for timeToSolve mapping
  const timeToSolveData = [
    { difficulty: 'Easy', avgMinutes: 15 },
    { difficulty: 'Medium', avgMinutes: 42 },
    { difficulty: 'Hard', avgMinutes: 75 }
  ];

  return (
    <div className="min-h-screen pt-24 px-4 pb-12 bg-[#020617]">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <header className="flex justify-between items-end">
            <div>
              <h1 className="text-5xl font-black mb-2 tracking-tight uppercase">Data <span className="gradient-text">Stream</span></h1>
              <p className="text-text-secondary font-medium tracking-wide">Synthesized analytics from your cognitive performance</p>
            </div>
            <div className="hidden md:block text-right">
              <div className="text-3xl font-black text-primary">{(data?.comparison?.user?.problemsSolved / 520 * 100).toFixed(1)}%</div>
              <div className="text-[10px] font-black uppercase opacity-40">System Completion</div>
            </div>
          </header>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Submission History - Large Chart */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
            className="lg:col-span-8 glass rounded-[2.5rem] p-10 border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 font-black text-6xl italic pointer-events-none uppercase">Activity</div>
            <h2 className="text-sm font-black tracking-widest uppercase opacity-40 mb-10">Real-time engagement history</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.submissionHistory}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(str) => str.slice(5)} />
                  <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(2, 6, 23, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', backdropFilter: 'blur(10px)' }}
                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: '900' }}
                  />
                  <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Language Usage - Side UI */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
            className="lg:col-span-4 glass rounded-[2.5rem] p-10 border border-white/5 flex flex-col items-center">
            <h2 className="text-sm font-black tracking-widest uppercase opacity-40 mb-6 w-full text-center">Language Core</h2>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.languageUsage || [{ language: 'None', count: 1 }]}
                    cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={8}
                    dataKey="count"
                  >
                    {(data?.languageUsage?.length > 0 ? data.languageUsage : [{}]).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="outline-none" stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip cursor={false} content={() => null} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full mt-6 space-y-3">
              {data?.languageUsage?.map((entry, index) => (
                <div key={entry.language} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-xs font-black uppercase tracking-tight">{entry.language}</span>
                  </div>
                  <span className="text-xs font-bold opacity-40">{entry.count}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Mastered Topics - List */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="lg:col-span-5 glass rounded-[2.5rem] p-10 border border-white/5">
            <h2 className="text-sm font-black tracking-widest uppercase opacity-40 mb-8">Mastered Nodes</h2>
            <div className="flex flex-wrap gap-3">
              {data?.masteredList?.length > 0 ? data.masteredList.map((topic, i) => (
                <div key={topic} className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-black tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {topic.toUpperCase()}
                </div>
              )) : (
                <p className="text-xs text-text-secondary opacity-50 italic font-medium">No topics mastered yet. Solve more nodes to synchronize.</p>
              )}
            </div>
          </motion.div>

          {/* Comparison - Dynamic Bars */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="lg:col-span-7 glass rounded-[2.5rem] p-10 border border-white/5">
            <h2 className="text-sm font-black tracking-widest uppercase opacity-40 mb-8">Performance Comparison</h2>
            <div className="space-y-8">
              {[
                { label: 'SOLVE VELOCITY', you: data?.comparison?.user?.problemsSolved, top: data?.comparison?.top50Avg?.problemsSolved, max: 500, color: 'bg-primary' },
                { label: 'CONSECUTIVE UPTIME', you: data?.comparison?.user?.streak, top: data?.comparison?.top50Avg?.streak, max: 150, color: 'bg-accent' },
                { label: 'NEURAL RATING', you: data?.comparison?.user?.contestRating, top: data?.comparison?.top50Avg?.contestRating, max: 3000, color: 'bg-green-500' },
              ].map((stat, i) => (
                <div key={i} className="group">
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-[8px] font-black opacity-30">PEER AVG: {stat.top}</span>
                      <span className="text-xl font-black">{stat.you}</span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${(stat.top / stat.max) * 100}%` }}
                      className={`absolute inset-0 ${stat.color} opacity-20`} 
                    />
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${(stat.you / stat.max) * 100}%` }}
                      className={`absolute inset-0 ${stat.color} shadow-[0_0_10px_currentColor]`} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
