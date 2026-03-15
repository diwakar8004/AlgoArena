const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');
const { addSubmission, getSubmissions, getUser, saveUser } = require('../services/firebaseStore');

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { problemId, code, language } = req.body;
    const statuses = ['Accepted','Wrong Answer','Time Limit Exceeded','Runtime Error'];
    const status = Math.random() > 0.4 ? 'Accepted' : statuses[Math.floor(Math.random()*statuses.length)];
    
    const user = await getUser(req.user.email);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const today = new Date().toISOString().split('T')[0];
    const submission = {
      userEmail: req.user.email,
      problemId,
      code,
      language,
      status,
      runtime: Math.floor(Math.random()*200)+10 + 'ms',
      memory: (Math.random()*20+5).toFixed(1) + 'MB',
      timestamp: new Date().toISOString(),
      testCasesPassed: status === 'Accepted' ? 15 : Math.floor(Math.random()*14)+1,
      totalTestCases: 15
    };

    const savedSubmission = await addSubmission(submission);

    if (status === 'Accepted') {
      // 1. Heatmap
      user.dailyActivity = user.dailyActivity || {};
      user.dailyActivity[today] = (user.dailyActivity[today] || 0) + 1;

      // 2. Solve count
      if (!user.solvedProblems.has(problemId)) {
        user.solvedProblems.add(problemId);
        user.problemsSolved = user.solvedProblems.size;
        
        // 3. Streak Logic
        const last = user.lastSolveDate ? new Date(user.lastSolveDate) : null;
        const curr = new Date(today);
        if (!last) user.streak = 1;
        else {
          const diff = Math.ceil(Math.abs(curr - last) / (1000 * 3600 * 24));
          if (diff === 1) user.streak += 1;
          else if (diff > 1) user.streak = 1;
        }
        user.lastSolveDate = today;
      }
      await saveUser(req.user.email, user);
    }

    res.json(savedSubmission);
  } catch (err) {
    res.status(500).json({ error: 'Submission failed' });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  const subs = await getSubmissions(req.user.email);
  res.json(subs);
});

router.post('/run', authenticateToken, (req, res) => {
  const { testCases } = req.body;
  const results = (testCases || [{ input: '[1,2,3]', expected: 'true' }]).map(tc => ({
    input: tc.input, expected: tc.expected,
    actual: Math.random() > 0.3 ? tc.expected : 'false',
    passed: Math.random() > 0.3, runtime: Math.floor(Math.random()*50)+5 + 'ms'
  }));
  res.json({ results, totalPassed: results.filter(r=>r.passed).length, total: results.length });
});

module.exports = router;
