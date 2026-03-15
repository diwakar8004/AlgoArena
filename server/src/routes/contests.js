const express = require('express');
const router = express.Router();
const { db } = require('../lib/firebaseAdmin');
const { getContests } = require('../services/firebaseStore');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

router.get('/', async (req, res) => {
  const contests = await getContests();
  res.json(contests);
});

router.get('/:id', async (req, res) => {
  const doc = await db.collection('contests').doc(req.params.id).get();
  if (!doc.exists) return res.status(404).json({ error: 'Contest not found' });
  res.json({ id: doc.id, ...doc.data() });
});

router.post('/', authenticateToken, authorizeAdmin, async (req, res) => {
  const { title, description, startTime, duration } = req.body;
  if (!title || !startTime || !duration) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const id = uuidv4();
  const newContest = {
    id, title, description,
    startTime,
    duration: Number(duration),
    participants: 0,
    status: 'upcoming'
  };
  await db.collection('contests').doc(id).set(newContest);
  res.status(201).json(newContest);
});

router.put('/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  await db.collection('contests').doc(req.params.id).update(req.body);
  res.json({ message: 'Updated' });
});

router.delete('/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  await db.collection('contests').doc(req.params.id).delete();
  res.json({ message: 'Deleted' });
});

module.exports = router;
