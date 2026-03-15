const express = require('express');
const router = express.Router();
const { db } = require('../lib/firebaseAdmin');

router.get('/', async (req, res) => {
  try {
    const snap = await db.collection('users')
      .orderBy('problemsSolved', 'desc')
      .limit(100)
      .get();
      
    const leaderboard = snap.docs.map(doc => {
      const u = doc.data();
      return {
        username: u.username,
        avatar: u.avatar,
        problemsSolved: u.problemsSolved || 0,
        streak: u.streak || 0,
        rating: 1500 + ((u.problemsSolved || 0) * 5)
      };
    });

    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: 'Failed' });
  }
});

module.exports = router;
