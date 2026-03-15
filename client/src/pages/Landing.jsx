import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';

const codeSnippets = [
  `def twoSum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        if target - n in seen:
            return [seen[target-n], i]
        seen[n] = i`,
  `int maxSubArray(vector<int>& nums) {
    int maxSum = nums[0], cur = 0;
    for (int n : nums) {
        cur = max(n, cur + n);
        maxSum = max(maxSum, cur);
    }
    return maxSum;
}`,
  `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}`,
];

const features = [
  { icon: '📚', title: 'Problem Bank', desc: '500+ curated DSA problems across 20+ topics with detailed solutions', color: 'from-blue-500 to-cyan-500' },
  { icon: '📈', title: 'Track Progress', desc: 'Visual heatmap, streak tracking, and topic-wise mastery analytics', color: 'from-green-500 to-emerald-500' },
  { icon: '🏆', title: 'Compete', desc: 'Weekly contests, live leaderboards, and global rankings', color: 'from-purple-500 to-pink-500' },
  { icon: '🗺️', title: 'Learn', desc: 'Step-by-step roadmap from beginner to advanced with curated resources', color: 'from-orange-500 to-red-500' },
];

const testimonials = [
  { name: 'Sarah Chen', role: 'Software Engineer at Google', text: 'AlgoArena completely transformed my interview prep. The structured roadmap and problem categorization saved me months.', avatar: 'SC' },
  { name: 'Alex Rivera', role: 'CS Student at MIT', text: 'The contest feature keeps me sharp and the analytics help me identify my weak spots. Best DSA platform out there!', avatar: 'AR' },
  { name: 'Priya Sharma', role: 'SDE at Amazon', text: 'From struggle to confidence — the editorial walkthroughs and hints system made hard problems approachable.', avatar: 'PS' },
];

const faqs = [
  { q: 'Is AlgoArena free?', a: 'Yes! AlgoArena is completely free. We believe quality DSA education should be accessible to everyone.' },
  { q: 'What languages are supported?', a: 'Our code editor supports C++, Java, Python, and JavaScript with syntax highlighting and auto-completion.' },
  { q: 'How are problems organized?', a: 'Problems are categorized by topic (Arrays, Trees, DP, etc.), difficulty (Easy/Medium/Hard), and source (LeetCode, Codeforces, etc.).' },
  { q: 'Can I track my progress?', a: 'Absolutely! Your dashboard shows a contribution heatmap, streak count, topic mastery rings, and detailed analytics.' },
];

const stats = [
  { value: '500+', label: 'Problems' },
  { value: '20+', label: 'Topics' },
  { value: '10K+', label: 'Users' },
  { value: '100K+', label: 'Submissions' },
];

export default function Landing() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
          {/* Floating code snippets */}
          {codeSnippets.map((code, i) => (
            <motion.div
              key={i}
              className="absolute hidden lg:block"
              style={{
                top: `${20 + i * 25}%`,
                left: i % 2 === 0 ? '3%' : undefined,
                right: i % 2 !== 0 ? '3%' : undefined,
              }}
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
            >
              <pre className="text-xs text-text-secondary/30 font-mono bg-surface-light/30 rounded-xl p-4 backdrop-blur-sm border border-border/20 max-w-xs overflow-hidden">
                {code}
              </pre>
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              New: Weekly Contests Now Live
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
              Master <span className="gradient-text">DSA</span>
              <br />
              <span className="text-text-secondary">Like Never Before</span>
            </h1>
            <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
              The ultimate competitive programming platform. Practice 500+ curated problems,
              track your progress, compete in contests, and land your dream job.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/signup"
                className="px-8 py-3.5 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105 text-lg"
              >
                Start Solving — It's Free
              </Link>
              <Link
                to="/problems"
                className="px-8 py-3.5 glass text-text font-semibold rounded-xl hover:bg-surface-lighter/50 transition-all duration-300 text-lg"
              >
                Browse Problems →
              </Link>
            </div>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {stats.map((s, i) => (
              <div key={i} className="glass rounded-xl p-4 text-center">
                <div className="text-2xl sm:text-3xl font-bold gradient-text">{s.value}</div>
                <div className="text-sm text-text-secondary">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need to <span className="gradient-text">Excel</span>
            </h2>
            <p className="text-text-secondary text-lg max-w-xl mx-auto">
              Built by competitive programmers, for competitive programmers.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 group cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-surface-light/30">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Loved by <span className="gradient-text">Developers</span></h2>
            <p className="text-text-secondary text-lg">Join thousands who've leveled up their skills</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold">{t.avatar}</div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-text-secondary">{t.role}</div>
                  </div>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">"{t.text}"</p>
                <div className="flex gap-1 mt-4">{[...Array(5)].map((_,j) => <span key={j} className="text-yellow-400">★</span>)}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Frequently Asked <span className="gradient-text">Questions</span></h2>
          </motion.div>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="glass rounded-xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between font-medium hover:bg-surface-lighter/30 transition-colors">
                  {f.q}
                  <svg className={`w-5 h-5 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="px-6 pb-4 text-sm text-text-secondary">{f.a}</motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center glass rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-text-secondary text-lg mb-8 max-w-xl mx-auto">Join 10,000+ developers mastering DSA. Free forever.</p>
            <Link to="/signup" className="inline-block px-8 py-3.5 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105 text-lg">
              Get Started Free →
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
