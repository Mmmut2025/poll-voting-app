const express = require('express');
const Poll = require('../models/Poll');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Create Poll
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  const { question, options, closingDate } = req.body;
  if (options.length < 2) return res.status(400).send('At least 2 options required');
  const poll = new Poll({ question, options, closingDate, createdBy: req.user.id });
  await poll.save();
  res.json(poll);
});

// Get open polls
router.get('/', authMiddleware, async (req, res) => {
  const polls = await Poll.find({ isClosed: false, closingDate: { $gte: new Date() } });
  res.json(polls);
});


// Get open polls
router.get('/:pollId', authMiddleware, async (req, res) => {
  const polls = await Poll.find(req.params.pollId);
  res.json(polls);
});

// Vote
router.post('/vote/:pollId', authMiddleware, async (req, res) => {
  const { optionIndex } = req.body;
  const poll = await Poll.findById(req.params.pollId);
  if (!poll || poll.isClosed || poll.closingDate < new Date()) return res.status(400).send('Poll closed');

  if (poll.voters.includes(req.user.id)) return res.status(403).send('Already voted');
  poll.options[optionIndex].votes += 1;
  poll.voters.push(req.user.id);
  await poll.save();
  res.send('Vote cast');
});

// View results
router.get('/results/:pollId', authMiddleware, async (req, res) => {
  const poll = await Poll.findById(req.params.pollId);
  if (!poll || !poll.voters.includes(req.user.id)) return res.status(403).send('Not authorized');
  if (!poll.isClosed && poll.closingDate > new Date()) return res.status(403).send('Poll still open');
  res.json(poll.options);
});

// View results
    router.get('/admin', authMiddleware, async (req, res) => {
    const poll = await Poll.find();
    console.log("polls",poll);
    res.json(poll);
    });

// Admin: Close poll manually
router.patch('/close/:pollId', authMiddleware, adminMiddleware, async (req, res) => {
  const poll = await Poll.findByIdAndUpdate(req.params.pollId, { isClosed: true });
  res.send('Poll closed');
});

module.exports = router;