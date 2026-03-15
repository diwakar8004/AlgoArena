import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const roadmapData = [
  {
    phase: 'Beginner', color: 'from-green-500 to-emerald-500', icon: '🌱',
    topics: [
      { id: 1, name: 'Arrays & Hashing', est: '1-2 weeks', problems: 15, resources: ['Array basics', 'Hash maps'], completed: true },
      { id: 2, name: 'Two Pointers', est: '1 week', problems: 10, resources: ['Pointer techniques'], completed: true },
      { id: 3, name: 'Sorting Algorithms', est: '1 week', problems: 8, resources: ['Merge sort', 'Quick sort'], completed: true },
      { id: 4, name: 'Binary Search', est: '1 week', problems: 12, resources: ['Search patterns'], completed: false },
      { id: 5, name: 'Strings', est: '1-2 weeks', problems: 15, resources: ['String manipulation'], completed: false },
    ]
  },
  {
    phase: 'Intermediate', color: 'from-blue-500 to-cyan-500', icon: '🚀',
    topics: [
      { id: 6, name: 'Stack & Queue', est: '1 week', problems: 12, resources: ['Stack patterns', 'Monotonic stack'], completed: false },
      { id: 7, name: 'Linked Lists', est: '1 week', problems: 10, resources: ['Fast/slow pointers'], completed: false },
      { id: 8, name: 'Trees (BFS/DFS)', est: '2 weeks', problems: 20, resources: ['Tree traversals', 'BST'], completed: false },
      { id: 9, name: 'Backtracking', est: '1-2 weeks', problems: 12, resources: ['Permutations', 'Combinations'], completed: false },
      { id: 10, name: 'Heap / Priority Queue', est: '1 week', problems: 10, resources: ['Top K problems'], completed: false },
      { id: 11, name: 'Sliding Window', est: '1 week', problems: 10, resources: ['Window patterns'], completed: false },
    ]
  },
  {
    phase: 'Advanced', color: 'from-purple-500 to-pink-500', icon: '⚡',
    topics: [
      { id: 12, name: 'Graphs (BFS/DFS)', est: '2-3 weeks', problems: 25, resources: ['Graph traversal', 'Topological sort'], completed: false },
      { id: 13, name: 'Dynamic Programming', est: '3-4 weeks', problems: 30, resources: ['1D DP', '2D DP', 'DP on trees'], completed: false },
      { id: 14, name: 'Greedy Algorithms', est: '1-2 weeks', problems: 15, resources: ['Interval scheduling'], completed: false },
      { id: 15, name: 'Trie', est: '1 week', problems: 8, resources: ['Prefix trees'], completed: false },
      { id: 16, name: 'Bit Manipulation', est: '1 week', problems: 10, resources: ['Bitwise operations'], completed: false },
    ]
  },
  {
    phase: 'Expert', color: 'from-red-500 to-orange-500', icon: '🏆',
    topics: [
      { id: 17, name: 'Advanced Graphs', est: '2-3 weeks', problems: 20, resources: ['Dijkstra', 'MST', 'Network flow'], completed: false },
      { id: 18, name: 'Advanced DP', est: '2-3 weeks', problems: 20, resources: ['Bitmask DP', 'Digit DP'], completed: false },
      { id: 19, name: 'Segment Trees', est: '1-2 weeks', problems: 10, resources: ['Range queries'], completed: false },
      { id: 20, name: 'Math & Number Theory', est: '1-2 weeks', problems: 12, resources: ['Primes', 'Modular arithmetic'], completed: false },
    ]
  },
];

export default function Roadmap() {
  const [completedNodes, setCompletedNodes] = useState(
    JSON.parse(localStorage.getItem('roadmapProgress') || '[]')
  );

  const toggleComplete = (id) => {
    const updated = completedNodes.includes(id) ? completedNodes.filter(n => n !== id) : [...completedNodes, id];
    setCompletedNodes(updated);
    localStorage.setItem('roadmapProgress', JSON.stringify(updated));
  };

  const totalTopics = roadmapData.reduce((acc, p) => acc + p.topics.length, 0);
  const completedCount = completedNodes.length;

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">🗺️ Learning Roadmap</h1>
          <p className="text-text-secondary mb-4">Your step-by-step guide from beginner to expert</p>
          <div className="inline-flex items-center gap-3 glass rounded-full px-6 py-2">
            <div className="w-32 h-2 rounded-full bg-surface-lighter overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                style={{ width: `${(completedCount / totalTopics) * 100}%` }} />
            </div>
            <span className="text-sm text-text-secondary">{completedCount}/{totalTopics} completed</span>
          </div>
        </motion.div>

        {/* Roadmap phases */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500 via-blue-500 via-purple-500 to-red-500 hidden md:block" />

          {roadmapData.map((phase, pi) => (
            <motion.div key={pi} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              transition={{ delay: pi * 0.1 }} className="mb-12">
              {/* Phase header */}
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${phase.color} flex items-center justify-center text-2xl relative z-10`}>
                  {phase.icon}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{phase.phase}</h2>
                  <p className="text-sm text-text-secondary">{phase.topics.length} topics</p>
                </div>
              </div>

              {/* Topics */}
              <div className="ml-0 md:ml-20 grid gap-3">
                {phase.topics.map((topic, ti) => {
                  const isComplete = completedNodes.includes(topic.id);
                  return (
                    <motion.div key={topic.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ delay: ti * 0.05 }}
                      className={`glass rounded-xl p-5 hover:border-primary/20 transition-all ${isComplete ? 'border-green-500/30' : ''}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <button onClick={() => toggleComplete(topic.id)}
                            className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                              isComplete ? 'bg-green-500 border-green-500 text-white' : 'border-border hover:border-primary'
                            }`}>
                            {isComplete && <span className="text-sm">✓</span>}
                          </button>
                          <div>
                            <h3 className={`font-semibold ${isComplete ? 'line-through text-text-secondary' : ''}`}>{topic.name}</h3>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-text-secondary">⏱ {topic.est}</span>
                              <span className="text-xs text-text-secondary">📝 {topic.problems} problems</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {topic.resources.map((r, ri) => (
                                <span key={ri} className="text-xs px-2 py-0.5 rounded-full bg-surface-lighter text-text-secondary">{r}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <Link to="/problems" className="text-xs px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium">
                          Practice →
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
