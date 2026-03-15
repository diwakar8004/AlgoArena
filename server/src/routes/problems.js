const express = require('express');
const router = express.Router();
const { getProblems, getProblem, getUser, getSubmissions } = require('../services/firebaseStore');
const { optionalAuth, authenticateToken, authorizeAdmin } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../lib/firebaseAdmin');

router.get('/', optionalAuth, async (req, res) => {
  try {
    const { topic, difficulty, tag, search, sort, page = 1, limit = 20 } = req.query;
    
    const { problems, total } = await getProblems({ topic, difficulty, tag, search, page, limit });
    
    const user = req.user ? await getUser(req.user.email) : null;
    const userSubs = req.user ? await getSubmissions(req.user.email) : [];

    const mapped = problems.map(({ description, editorial, hints, starterCode, testCases, ...p }) => {
      let status = null;
      if (user) {
        if (user.solvedProblems.has(p.id)) status = 'Solved';
        else if (userSubs.some(s => s.problemId === p.id)) status = 'Attempted';
      }
      return { ...p, status };
    });

    res.json({ 
      problems: mapped, 
      total, 
      page: Number(page), 
      totalPages: Math.ceil(total / Number(limit)) 
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch problems' });
  }
});

router.get('/topics', async (req, res) => {
  try {
    const snap = await db.collection('problems').get();
    const topicCounts = {};
    snap.docs.forEach(doc => {
      const p = doc.data();
      topicCounts[p.topic] = (topicCounts[p.topic] || 0) + 1;
    });
    res.json(topicCounts);
  } catch (err) {
    res.status(500).json({ error: 'Failed' });
  }
});

router.post('/', authenticateToken, authorizeAdmin, async (req, res) => {
  const { title, topic, difficulty, tags, description, constraints, examples, starterCode, testCases } = req.body;
  if (!title || !topic || !difficulty) return res.status(400).json({ error: 'Missing fields' });

  const id = uuidv4();
  const newProblem = {
    id,
    slug: title.toLowerCase().replace(/\s+/g, '-'),
    title, topic, difficulty,
    tags: tags || [],
    acceptance: 0,
    totalSubmissions: 0,
    description,
    constraints: constraints || [],
    examples: examples || [],
    starterCode: starterCode || {},
    testCases: testCases || []
  };

  await db.collection('problems').doc(id).set(newProblem);
  res.status(201).json(newProblem);
});

router.put('/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    await db.collection('problems').doc(req.params.id).update(req.body);
    res.json({ message: 'Updated' });
  } catch (err) {
    res.status(404).json({ error: 'Not found' });
  }
});

router.delete('/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  await db.collection('problems').doc(req.params.id).delete();
  res.json({ message: 'Deleted' });
});

router.get('/:id', optionalAuth, async (req, res) => {
  const problem = await getProblem(req.params.id);
  if (!problem) return res.status(404).json({ error: 'Problem not found' });
  
  let status = null;
  if (req.user) {
    const user = await getUser(req.user.email);
    const userSubs = await getSubmissions(req.user.email);
    if (user?.solvedProblems.has(problem.id)) status = 'Solved';
    else if (userSubs.some(s => s.problemId === problem.id)) status = 'Attempted';
  }

  res.json({ ...problem, status });
});

module.exports = router;
