import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import api from '../lib/api';
import { useBookmarkStore, useAuthStore } from '../store';

const languages = [
  { value: 'python', label: 'Python', monacoLang: 'python' },
  { value: 'cpp', label: 'C++', monacoLang: 'cpp' },
  { value: 'java', label: 'Java', monacoLang: 'java' },
  { value: 'javascript', label: 'JavaScript', monacoLang: 'javascript' },
];

export default function ProblemDetail() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [running, setRunning] = useState(false);
  const [showHints, setShowHints] = useState([]);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    { id: 1, user: 'codemaster', text: 'Great problem! The two-pointer approach works well here.', time: '2 hours ago', likes: 5 },
    { id: 2, user: 'algorithmist', text: 'You can also solve this using a hash map for O(n) time complexity.', time: '5 hours ago', likes: 12 },
    { id: 3, user: 'dpwizard', text: 'The key insight is to think about what information you need at each step.', time: '1 day ago', likes: 8 },
  ]);
  const { bookmarks, toggleBookmark, markSolved, markAttempted } = useBookmarkStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    fetchProblem();
  }, [id]);

  useEffect(() => {
    if (problem?.starterCode?.[language]) {
      setCode(problem.starterCode[language]);
    }
  }, [language, problem]);

  const fetchProblem = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/problems/${id}`);
      setProblem(data);
      if (data.starterCode?.python) setCode(data.starterCode.python);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRun = async () => {
    setRunning(true);
    setOutput(null);
    markAttempted(id);
    try {
      const { data } = await api.post('/submissions/run', { code, language, testCases: problem.testCases });
      setOutput({ type: 'run', ...data });
    } catch (err) {
      setOutput({ type: 'error', message: 'Failed to run code. Make sure you are logged in.' });
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setOutput(null);
    try {
      const { data } = await api.post('/submissions', { problemId: id, code, language });
      setOutput({ type: 'submit', ...data });
      if (data.status === 'Accepted') markSolved(id);
      else markAttempted(id);
    } catch (err) {
      setOutput({ type: 'error', message: 'Submission failed. Make sure you are logged in.' });
    } finally {
      setSubmitting(false);
    }
  };

  const addComment = () => {
    if (!comment.trim()) return;
    setComments([{ id: Date.now(), user: 'you', text: comment, time: 'just now', likes: 0 }, ...comments]);
    setComment('');
  };

  if (loading) return (
    <div className="min-h-screen pt-20 flex justify-center items-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!problem) return (
    <div className="min-h-screen pt-20 flex justify-center items-center">
      <p className="text-text-secondary">Problem not found</p>
    </div>
  );

  const getDiffColor = (d) => d === 'Easy' ? 'text-green-400' : d === 'Medium' ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="min-h-screen pt-16">
      <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
        {/* Left panel - Problem description */}
        <div className="lg:w-1/2 overflow-y-auto border-r border-border/30">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold mb-1">{problem.id}. {problem.title}</h1>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-medium ${getDiffColor(problem.difficulty)}`}>{problem.difficulty}</span>
                  <span className="text-xs text-text-secondary">{problem.topic}</span>
                  {problem.tags?.map(t => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-surface-lighter text-text-secondary">{t}</span>
                  ))}
                </div>
              </div>
              <button onClick={() => toggleBookmark(problem.id)} className="text-2xl hover:scale-110 transition-transform">
                {bookmarks.includes(problem.id) ? '🔖' : '☆'}
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-border/30 mb-6">
              {['description','hints','editorial','discuss'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors relative ${
                    activeTab === tab ? 'text-primary' : 'text-text-secondary hover:text-text'
                  }`}>
                  {tab}
                  {activeTab === tab && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === 'description' && (
              <div className="prose prose-invert max-w-none">
                <div className="text-sm leading-relaxed whitespace-pre-wrap text-text-secondary">{problem.description}</div>
                <div className="mt-6">
                  <h3 className="text-base font-semibold mb-3">Constraints</h3>
                  <ul className="space-y-1">{problem.constraints?.map((c,i) => <li key={i} className="text-sm text-text-secondary font-mono">• {c}</li>)}</ul>
                </div>
                <div className="mt-6">
                  <h3 className="text-base font-semibold mb-3">Examples</h3>
                  {problem.examples?.map((ex,i) => (
                    <div key={i} className="mb-4 p-4 rounded-lg bg-surface-light border border-border/30">
                      <p className="text-xs text-text-secondary mb-1 font-semibold">Example {i+1}:</p>
                      <p className="text-sm font-mono"><span className="text-text-secondary">Input:</span> {ex.input}</p>
                      <p className="text-sm font-mono"><span className="text-text-secondary">Output:</span> {ex.output}</p>
                      {ex.explanation && <p className="text-sm mt-2 text-text-secondary"><strong>Explanation:</strong> {ex.explanation}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'hints' && (
              <div className="space-y-3">
                {problem.hints?.map((hint, i) => (
                  <div key={i} className="rounded-lg border border-border/30 overflow-hidden">
                    <button onClick={() => setShowHints(showHints.includes(i) ? showHints.filter(h => h !== i) : [...showHints, i])}
                      className="w-full px-4 py-3 text-left text-sm font-medium flex items-center justify-between hover:bg-surface-lighter/30 transition-colors">
                      Hint {i + 1}
                      <span>{showHints.includes(i) ? '−' : '+'}</span>
                    </button>
                    {showHints.includes(i) && <div className="px-4 pb-3 text-sm text-text-secondary">{hint}</div>}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'editorial' && (
              <div className="text-sm text-text-secondary whitespace-pre-wrap leading-relaxed">{problem.editorial}</div>
            )}

            {activeTab === 'discuss' && (
              <div>
                <div className="flex gap-2 mb-6">
                  <input value={comment} onChange={e => setComment(e.target.value)} placeholder="Add a comment..."
                    className="flex-1 px-4 py-2.5 rounded-lg bg-surface-light border border-border focus:border-primary outline-none text-sm" />
                  <button onClick={addComment} className="px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">Post</button>
                </div>
                <div className="space-y-4">
                  {comments.map(c => (
                    <div key={c.id} className="p-4 rounded-lg bg-surface-light/50 border border-border/20">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold">{c.user[0].toUpperCase()}</div>
                        <span className="text-sm font-medium">{c.user}</span>
                        <span className="text-xs text-text-secondary">{c.time}</span>
                      </div>
                      <p className="text-sm text-text-secondary">{c.text}</p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-text-secondary">
                        <button className="hover:text-primary transition-colors">👍 {c.likes}</button>
                        <button className="hover:text-primary transition-colors">Reply</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right panel - Code editor */}
        <div className="lg:w-1/2 flex flex-col">
          {/* Editor toolbar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-border/30 bg-surface-light/50">
            <select value={language} onChange={e => setLanguage(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-surface border border-border text-sm outline-none focus:border-primary">
              {languages.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
            <div className="flex gap-2">
              <button onClick={handleRun} disabled={running}
                className="px-4 py-1.5 rounded-lg bg-surface-lighter text-sm font-medium hover:bg-surface-lighter/80 transition-colors disabled:opacity-50 flex items-center gap-1.5">
                {running ? <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" /> : '▶'}
                Run
              </button>
              <button onClick={handleSubmit} disabled={submitting}
                className="px-4 py-1.5 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-1.5">
                {submitting ? <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" /> : '⬆'}
                Submit
              </button>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 min-h-0">
            <Editor
              height="100%"
              language={languages.find(l => l.value === language)?.monacoLang}
              value={code}
              onChange={setCode}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                scrollBeyondLastLine: false,
                padding: { top: 16 },
                lineNumbers: 'on',
                renderLineHighlight: 'line',
                cursorBlinking: 'smooth',
                smoothScrolling: true,
                wordWrap: 'on',
              }}
            />
          </div>

          {/* Output panel */}
          {output && (
            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="border-t border-border/30 bg-surface-light/50 max-h-48 overflow-y-auto">
              <div className="p-4">
                {output.type === 'error' ? (
                  <p className="text-red-400 text-sm">{output.message}</p>
                ) : output.type === 'run' ? (
                  <div>
                    <p className="text-sm font-medium mb-2">Test Results: {output.totalPassed}/{output.total} passed</p>
                    {output.results?.map((r, i) => (
                      <div key={i} className={`text-xs font-mono p-2 rounded mb-1 ${r.passed ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'}`}>
                        {r.passed ? '✓' : '✗'} Input: {r.input} | Expected: {r.expected} | Got: {r.actual}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <div className={`text-lg font-bold mb-2 ${output.status === 'Accepted' ? 'text-green-400' : 'text-red-400'}`}>
                      {output.status === 'Accepted' ? '🎉' : '❌'} {output.status}
                    </div>
                    <div className="flex gap-4 text-xs text-text-secondary">
                      <span>Runtime: {output.runtime}</span>
                      <span>Memory: {output.memory}</span>
                      <span>Tests: {output.testCasesPassed}/{output.totalTestCases}</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
