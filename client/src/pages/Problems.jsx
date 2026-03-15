import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../lib/api';
import { useBookmarkStore } from '../store';

const topics = ['All','Arrays','Strings','Linked List','Stack','Queue','Trees','Graphs','Dynamic Programming','Greedy','Backtracking','Sliding Window','Two Pointers','Bit Manipulation','Heap','Trie','Binary Search','Sorting','Hashing','Math','Recursion'];
const difficulties = ['All','Easy','Medium','Hard'];
const sortOptions = [{ value: '', label: 'Default' },{ value: 'title', label: 'Title' },{ value: 'difficulty', label: 'Difficulty' },{ value: 'acceptance', label: 'Acceptance' }];

export default function Problems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ topic: '', difficulty: '', search: '', sort: '', page: 1 });
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const { bookmarks, solved, attempted, toggleBookmark } = useBookmarkStore();

  useEffect(() => {
    fetchProblems();
  }, [filters]);

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.topic && filters.topic !== 'All') params.topic = filters.topic;
      if (filters.difficulty && filters.difficulty !== 'All') params.difficulty = filters.difficulty;
      if (filters.search) params.search = filters.search;
      if (filters.sort) params.sort = filters.sort;
      params.page = filters.page;
      params.limit = 20;
      const { data } = await api.get('/problems', { params });
      setProblems(data.problems);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (err) {
      console.error('Failed to fetch problems:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDiffBadge = (d) => d === 'Easy' ? 'badge-easy' : d === 'Medium' ? 'badge-medium' : 'badge-hard';
  const getStatus = (id) => solved.includes(id) ? '✅' : attempted.includes(id) ? '🔄' : '';

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Problem Bank</h1>
          <p className="text-text-secondary">{total} problems across {topics.length - 1} topics</p>
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass rounded-xl p-4 mb-6 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
          <div className="flex-1">
            <input type="text" placeholder="Search problems..." value={filters.search}
              onChange={e => setFilters({...filters, search: e.target.value, page: 1})}
              className="w-full px-4 py-2.5 rounded-lg bg-surface-light border border-border focus:border-primary outline-none text-sm" />
          </div>
          <select value={filters.topic} onChange={e => setFilters({...filters, topic: e.target.value, page: 1})}
            className="px-4 py-2.5 rounded-lg bg-surface-light border border-border text-sm outline-none focus:border-primary">
            {topics.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={filters.difficulty} onChange={e => setFilters({...filters, difficulty: e.target.value, page: 1})}
            className="px-4 py-2.5 rounded-lg bg-surface-light border border-border text-sm outline-none focus:border-primary">
            {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={filters.sort} onChange={e => setFilters({...filters, sort: e.target.value})}
            className="px-4 py-2.5 rounded-lg bg-surface-light border border-border text-sm outline-none focus:border-primary">
            {sortOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </motion.div>

        {/* Problem table */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <div className="glass rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider w-12">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Title</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider hidden sm:table-cell">Topic</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Difficulty</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider hidden md:table-cell">Acceptance</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider w-12">Save</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {problems.map((p, i) => (
                      <motion.tr key={p.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}
                        className="hover:bg-surface-lighter/30 transition-colors group">
                        <td className="px-4 py-3 text-center">{getStatus(p.id)}</td>
                        <td className="px-4 py-3">
                          <Link to={`/problems/${p.id}`} className="text-sm font-medium hover:text-primary transition-colors group-hover:text-primary">
                            {p.id}. {p.title}
                          </Link>
                          <div className="flex gap-1 mt-1 sm:hidden">
                            <span className="text-xs text-text-secondary">{p.topic}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span className="text-xs px-2.5 py-1 rounded-full bg-surface-lighter text-text-secondary">{p.topic}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getDiffBadge(p.difficulty)}`}>{p.difficulty}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-text-secondary hidden md:table-cell">{p.acceptance}%</td>
                        <td className="px-4 py-3 text-right">
                          <button onClick={() => toggleBookmark(p.id)} className="text-text-secondary hover:text-yellow-400 transition-colors">
                            {bookmarks.includes(p.id) ? '🔖' : '☆'}
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-text-secondary">Page {filters.page} of {totalPages}</p>
              <div className="flex gap-2">
                <button onClick={() => setFilters({...filters, page: Math.max(1, filters.page - 1)})} disabled={filters.page === 1}
                  className="px-4 py-2 rounded-lg glass text-sm font-medium disabled:opacity-50 hover:bg-surface-lighter/50 transition-colors">← Prev</button>
                <button onClick={() => setFilters({...filters, page: Math.min(totalPages, filters.page + 1)})} disabled={filters.page === totalPages}
                  className="px-4 py-2 rounded-lg glass text-sm font-medium disabled:opacity-50 hover:bg-surface-lighter/50 transition-colors">Next →</button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
