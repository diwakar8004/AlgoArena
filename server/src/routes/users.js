const express = require('express');
const router = express.Router();
const { db } = require('../lib/firebaseAdmin');
const { getUser, getSubmissions, saveUser } = require('../services/firebaseStore');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const user = await getUser(req.user.email);
    if (!user) return res.status(404).json({ error: 'User not found' });

    let submissions = [];
    try {
      submissions = await getSubmissions(req.user.email);
    } catch (subErr) {
      console.warn('Submissions fetch failed (likely missing index):', subErr.message);
    }
    
    // Calculate global rank safely
    let rank = 'N/A';
    try {
      const usersSnap = await db.collection('users').orderBy('problemsSolved', 'desc').get();
      const foundIndex = usersSnap.docs.findIndex(doc => doc.id === req.user.email);
      rank = foundIndex !== -1 ? foundIndex + 1 : 'N/A';
    } catch (rankErr) {
      console.warn('Rank calculation error:', rankErr.message);
    }

    res.json({ 
      stats: {
        problemsSolved: user.solvedProblems?.length || 0,
        streak: user.streak || 0,
        rank: rank,
        topicsMastered: 0,
        badge: 'Beginner'
      },
      heatmap: user.dailyActivity || {},
      recentSubmissions: submissions.slice(0, 5),
      recommended: []
    });
  } catch (err) {
    console.error('Dashboard Error:', err);
    res.status(500).json({ error: 'Dashboard failed', message: err.message });
  }
});

router.get('/analytics', authenticateToken, async (req, res) => {
  const user = await getUser(req.user.email);
  if (!user) return res.status(404).json({ error: 'User not found' });
  
  res.json({ 
    submissionHistory: [], 
    languageUsage: [],
    topicProgress: {},
    comparison: { user: { problemsSolved: user.problemsSolved, streak: user.streak } }
  });
});

// Admin User Management
router.get('/', authenticateToken, authorizeAdmin, async (req, res) => {
  const snap = await db.collection('users').get();
  res.json(snap.docs.map(doc => {
    const { password, ...rest } = doc.data();
    return rest;
  }));
});

router.put('/:email', authenticateToken, authorizeAdmin, async (req, res) => {
  await db.collection('users').doc(req.params.email).update(req.body);
  res.json({ message: 'User updated' });
});

router.delete('/:email', authenticateToken, authorizeAdmin, async (req, res) => {
  if (req.params.email === 'demo@example.com') return res.status(403).json({ error: 'Protected' });
  await db.collection('users').doc(req.params.email).delete();
  res.json({ message: 'User deleted' });
});

module.exports = router;
