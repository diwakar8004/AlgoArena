import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/api';
import { toast } from 'react-hot-toast';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('problems');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ problems: [], contests: [], users: [] });
  const [editingItem, setEditingItem] = useState(null);

  // Form states
  const [problemForm, setProblemForm] = useState({
    title: '', topic: 'Arrays', difficulty: 'Easy',
    description: '', constraints: '',
    exampleInput: '', exampleOutput: '', exampleExplanation: ''
  });

  const [contestForm, setContestForm] = useState({
    title: '', description: '', startTime: '', duration: 120
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pRes, cRes, uRes] = await Promise.all([
        api.get('/problems?limit=100'),
        api.get('/contests'),
        api.get('/users')
      ]);
      setData({
        problems: pRes.data.problems,
        contests: cRes.data,
        users: uRes.data
      });
    } catch (err) {
      toast.error('Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateProblem = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingItem) {
        await api.put(`/problems/${editingItem.id}`, {
          ...problemForm,
          constraints: typeof problemForm.constraints === 'string' ? problemForm.constraints.split('\n').filter(c => c.trim()) : problemForm.constraints,
        });
        toast.success('Problem updated!');
      } else {
        await api.post('/problems', {
          ...problemForm,
          constraints: problemForm.constraints.split('\n').filter(c => c.trim()),
          examples: [{
            input: problemForm.exampleInput,
            output: problemForm.exampleOutput,
            explanation: problemForm.exampleExplanation
          }]
        });
        toast.success('Problem created!');
      }
      setProblemForm({ title: '', topic: 'Arrays', difficulty: 'Easy', description: '', constraints: '', exampleInput: '', exampleOutput: '', exampleExplanation: '' });
      setEditingItem(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProblem = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/problems/${id}`);
      toast.success('Problem deleted');
      fetchData();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingItem) {
        await api.put(`/contests/${editingItem.id}`, contestForm);
        toast.success('Event updated!');
      } else {
        await api.post('/contests', contestForm);
        toast.success('Event created!');
      }
      setContestForm({ title: '', description: '', startTime: '', duration: 120 });
      setEditingItem(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await api.delete(`/contests/${id}`);
      toast.success('Event deleted');
      fetchData();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handleUpdateUserRole = async (email, newRole) => {
    try {
      await api.put(`/users/${email}`, { role: newRole });
      toast.success('Role updated');
      fetchData();
    } catch (err) {
      toast.error('Failed to update role');
    }
  };

  const handleDeleteUser = async (email) => {
    if (!window.confirm('Permanently delete this user?')) return;
    try {
      await api.delete(`/users/${email}`);
      toast.success('User removed');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Delete failed');
    }
  };

  const startEditProblem = (p) => {
    setEditingItem(p);
    setProblemForm({
      title: p.title,
      topic: p.topic,
      difficulty: p.difficulty,
      description: p.description || '',
      constraints: Array.isArray(p.constraints) ? p.constraints.join('\n') : p.constraints || '',
      exampleInput: p.examples?.[0]?.input || '',
      exampleOutput: p.examples?.[0]?.output || '',
      exampleExplanation: p.examples?.[0]?.explanation || ''
    });
    setActiveTab('add-problem');
  };

  return (
    <div className="min-h-screen pt-24 px-4 pb-12 bg-background">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-black mb-2 tracking-tight">🛠 SYSTEM CONTROL</h1>
          <p className="text-text-secondary">Global management of problems, events, and user registry</p>
        </header>

        {/* Sidebar-like Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-surface/30 p-2 rounded-2xl border border-border/30 backdrop-blur-sm">
          {[
            { id: 'problems', label: '📚 Problems', color: 'primary' },
            { id: 'contests', label: '🏆 Contests', color: 'accent' },
            { id: 'users', label: '👥 Users', color: 'green-500' },
            { id: 'add-problem', label: '➕ New Problem', color: 'primary' },
            { id: 'add-contest', label: '🗓 New Event', color: 'accent' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (!tab.id.startsWith('add')) setEditingItem(null);
              }}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === tab.id
                  ? `bg-${tab.color} text-white shadow-lg`
                  : 'hover:bg-surface-lighter/50 text-text-secondary'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid gap-8">
          {/* Problems List */}
          {activeTab === 'problems' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-3xl overflow-hidden border border-border/50">
              <div className="p-6 border-b border-white/5 bg-white/5 flex justify-between items-center">
                <h2 className="font-bold">Problem Registry ({data.problems.length})</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-white/5 text-xs uppercase text-text-secondary font-bold">
                    <tr>
                      <th className="px-6 py-4">Title</th>
                      <th className="px-6 py-4">Topic</th>
                      <th className="px-6 py-4">Difficulty</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {data.problems.map(p => (
                      <tr key={p.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-bold">{p.title}</td>
                        <td className="px-6 py-4"><span className="px-2 py-1 rounded bg-surface text-xs">{p.topic}</span></td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-bold ${p.difficulty === 'Easy' ? 'text-green-500' : p.difficulty === 'Medium' ? 'text-yellow-500' : 'text-red-500'
                            }`}>{p.difficulty}</span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button onClick={() => startEditProblem(p)} className="p-2 hover:text-primary transition-colors">✏️</button>
                          <button onClick={() => handleDeleteProblem(p.id)} className="p-2 hover:text-danger transition-colors">🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Contests List */}
          {activeTab === 'contests' && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.contests.map(c => (
                <motion.div key={c.id} className="glass p-6 rounded-3xl border border-border/50 group relative">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${c.status === 'upcoming' ? 'bg-accent/20 text-accent' : 'bg-green-500/20 text-green-500'
                      }`}>{c.status}</span>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingItem(c); setContestForm(c); setActiveTab('add-contest'); }} className="opacity-0 group-hover:opacity-100 p-2 glass rounded-lg hover:text-primary transition-all">✏️</button>
                      <button onClick={() => handleDeleteEvent(c.id)} className="opacity-0 group-hover:opacity-100 p-2 glass rounded-lg hover:text-danger transition-all">🗑️</button>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{c.title}</h3>
                  <p className="text-sm text-text-secondary line-clamp-2 mb-4">{c.description}</p>
                  <div className="flex items-center gap-4 text-xs font-medium text-text-secondary italic">
                    <span>📅 {new Date(c.startTime).toLocaleDateString()}</span>
                    <span>⏱ {c.duration} mins</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Users List */}
          {activeTab === 'users' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-surface text-xs font-black uppercase opacity-60">
                    <tr>
                      <th className="px-6 py-5">User</th>
                      <th className="px-6 py-5">Email</th>
                      <th className="px-6 py-5">Role</th>
                      <th className="px-6 py-5 text-right">Settings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {data.users.map(u => (
                      <tr key={u.email} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center font-bold text-primary">
                              {u.username[0].toUpperCase()}
                            </div>
                            <span className="font-bold">{u.username}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm opacity-60">{u.email}</td>
                        <td className="px-6 py-5">
                          <select
                            value={u.role}
                            onChange={(e) => handleUpdateUserRole(u.email, e.target.value)}
                            disabled={u.email === 'xyzz@example.com'}
                            className="bg-surface-lighter/50 border border-border/30 rounded-lg px-2 py-1 text-xs font-bold outline-none focus:border-primary disabled:opacity-50"
                          >
                            <option value="user">USER</option>
                            <option value="admin">ADMIN</option>
                          </select>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <button
                            onClick={() => handleDeleteUser(u.email)}
                            disabled={u.email === 'demo@example.com'}
                            className="text-text-secondary hover:text-danger p-2 transition-colors disabled:opacity-0"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Form Section */}
          {(activeTab === 'add-problem' || activeTab === 'add-contest') && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-3xl p-10 border border-border/50 max-w-3xl mx-auto w-full">
              <h2 className="text-2xl font-black mb-8 flex items-center gap-4">
                {editingItem ? '⚡️ EDITING MODE' : '✨ NEW SUBMISSION'}
                {editingItem && <button onClick={() => { setEditingItem(null); setProblemForm({ title: '', topic: 'Arrays', difficulty: 'Easy', description: '', constraints: '', exampleInput: '', exampleOutput: '', exampleExplanation: '' }); }} className="px-3 py-1 rounded-full bg-danger/20 text-danger text-xs font-black uppercase">Cancel</button>}
              </h2>

              {activeTab === 'add-problem' ? (
                <form onSubmit={handleCreateProblem} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-black uppercase mb-2 opacity-60">Problem Title</label>
                      <input required value={problemForm.title} onChange={e => setProblemForm({ ...problemForm, title: e.target.value })} className="form-input" placeholder="e.g. Reverse Linked List" />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase mb-2 opacity-60">Category</label>
                      <select value={problemForm.topic} onChange={e => setProblemForm({ ...problemForm, topic: e.target.value })} className="form-input">
                        {['Arrays', 'Strings', 'Trees', 'Graphs', 'Dynamic Programming', 'Greedy', 'Stack', 'Queue', 'Binary Search'].map(t => <option key={t} value={t} className="bg-surface">{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase mb-2 opacity-60">Difficulty Selection</label>
                    <div className="flex gap-4">
                      {['Easy', 'Medium', 'Hard'].map(d => (
                        <button key={d} type="button" onClick={() => setProblemForm({ ...problemForm, difficulty: d })}
                          className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${problemForm.difficulty === d ? 'bg-primary text-white shadow-lg ring-2 ring-primary/20' : 'bg-surface-lighter/50 hover:bg-surface-lighter text-text-secondary'
                            }`}>{d}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase mb-2 opacity-60">Statement</label>
                    <textarea required rows={5} value={problemForm.description} onChange={e => setProblemForm({ ...problemForm, description: e.target.value })} className="form-input resize-none" placeholder="Provide a detailed description of the problem..." />
                  </div>
                  <button disabled={loading} className="w-full py-5 bg-primary text-white rounded-2xl font-black text-sm tracking-widest hover:shadow-2xl hover:shadow-primary/30 transition-all disabled:opacity-50">
                    {loading ? 'PROCESSING...' : (editingItem ? 'UPDATE PROBLEM' : 'PUBLISH PROBLEM')}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleCreateEvent} className="space-y-6">
                  <div>
                    <label className="block text-xs font-black uppercase mb-2 opacity-60">Event Title</label>
                    <input required value={contestForm.title} onChange={e => setContestForm({ ...contestForm, title: e.target.value })} className="form-input" placeholder="Monthly Showdown #5" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-black uppercase mb-2 opacity-60">Live Start Date & Time</label>
                      <input required type="datetime-local" value={contestForm.startTime} onChange={e => setContestForm({ ...contestForm, startTime: e.target.value })} className="form-input" />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase mb-2 opacity-60">Window (Minutes)</label>
                      <input required type="number" value={contestForm.duration} onChange={e => setContestForm({ ...contestForm, duration: e.target.value })} className="form-input" />
                    </div>
                  </div>
                  <button disabled={loading} className="w-full py-5 bg-accent text-white rounded-2xl font-black text-sm tracking-widest hover:shadow-2xl hover:shadow-accent/30 transition-all disabled:opacity-50">
                    {loading ? 'SCHEDULING...' : (editingItem ? 'UPDATE CONTEST' : 'LAUNCH CONTEST')}
                  </button>
                </form>
              )}
            </motion.div>
          )}
        </div>
      </div>
      <style>{`
        .form-input {
          width: 100%;
          padding: 1rem 1.25rem;
          border-radius: 1rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          font-size: 0.875rem;
          outline: none;
          transition: all 0.2s;
        }
        .form-input:focus {
          border-color: var(--primary);
          background: rgba(255, 255, 255, 0.05);
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }
        option {
          background: #0f172a;
          color: white;
        }
      `}</style>
    </div>
  );
}
