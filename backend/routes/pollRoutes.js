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

// View results
router.get('/admin/all', authMiddleware, async (req, res) => {
  console.log("Inside /admin/all");
  const poll = await Poll.find();
  res.json(poll);
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

// update Poll
router.put('/:pollId', authMiddleware, adminMiddleware, async (req, res) => {
  console.log('req',req.params.pollId)
  const { question, options, closingDate } = req.body;
  if (options.length < 2) return res.status(400).send('At least 2 options required');
  const poll = await Poll.findById(req.params.pollId);
    if (!poll) return res.status(404).json({ error: 'Poll not found' });

    // Update fields
    poll.question = question;
    poll.options = options;
    poll.closingDate = closingDate;

    await poll.save();
    res.json(poll);
});

// delete 
router.delete('/:pollId', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const poll = await Poll.findByIdAndDelete(req.params.pollId);

    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    res.json({ message: 'Poll deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while deleting poll' });
  }
});

module.exports = router;