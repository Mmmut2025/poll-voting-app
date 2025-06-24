const express = require('express');
const Poll = require('../models/Poll');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// ===================== ADMIN Routes ===================== //

// Create a new poll (Admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  const { question, options, closingDate } = req.body;
  if (options.length < 2) return res.status(400).send('At least 2 options required');
  const poll = new Poll({ question, options, closingDate, createdBy: req.user.id });
  await poll.save();
  res.json(poll);
});

//  Get all polls (Admin only)
router.get('/admin/all', authMiddleware, adminMiddleware, async (req, res) => {
  const polls = await Poll.find();
  res.json(polls);
});


// Update a poll (Only by the admin who created it)
router.put('/:pollId', authMiddleware, adminMiddleware, async (req, res) => {
  const { question, options, closingDate } = req.body;

  if (options.length < 2) {
    return res.status(400).send('At least 2 options required');
  }

  try {
    const poll = await Poll.findById(req.params.pollId);

    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    // Check if the logged-in admin is the one who created the poll
    if (poll.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: 'You are not authorized to update this poll' });
    }

    // Update fields
    poll.question = question;
    poll.options = options;
    poll.closingDate = closingDate;

    await poll.save();
    res.json(poll);

  } catch (err) {
    console.error('Error updating poll:', err);
    res.status(500).json({ error: 'Server error while updating poll' });
  }
});


//  Close a poll manually (Admin only)
router.patch('/close/:pollId', authMiddleware, adminMiddleware, async (req, res) => {
  const poll = await Poll.findByIdAndUpdate(req.params.pollId, { isClosed: true });
  res.send('Poll closed');
});



// DELETE /polls/:pollId - Only the admin who created the poll can delete it
router.delete('/:pollId', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.pollId);

    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    // Check if current admin is the one who created the poll
    if (poll.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized: You can only delete your own polls' });
    }

    await poll.deleteOne();

    res.json({ message: 'Poll deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Server error while deleting poll' });
  }
});


// ===================== USER Routes ===================== //

// Get open polls (visible to all logged-in users)
router.get('/', authMiddleware, async (req, res) => {
  const polls = await Poll.find({
    isClosed: false,
    closingDate: { $gte: new Date() }
  });
  res.json(polls);
});

//  Get closed polls (results view for users) — Must be placed BEFORE dynamic :pollId
router.get('/closed', authMiddleware, async (req, res) => {
  try {
    const now = new Date();
    const closedPolls = await Poll.find({ closingDate: { $lt: now } });

    res.json(closedPolls);
  } catch (err) {
    console.error('Error fetching closed polls:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

//  Vote on a poll
router.post('/vote/:pollId', authMiddleware, async (req, res) => {
  const { optionIndex } = req.body;
  const poll = await Poll.findById(req.params.pollId);

  if (!poll || poll.isClosed || poll.closingDate < new Date())
    return res.status(400).send('Poll closed');

  if (poll.voters.includes(req.user.id))
    return res.status(403).send('Already voted');

  poll.options[optionIndex].votes += 1;
  poll.voters.push(req.user.id);
  await poll.save();
  res.send('Vote cast');
});

//  View poll results (only if user has voted & poll is closed)
router.get('/results/:pollId', authMiddleware, async (req, res) => {
  const poll = await Poll.findById(req.params.pollId);
  if (!poll || !poll.voters.includes(req.user.id))
    return res.status(403).send('Not authorized');
  if (!poll.isClosed && poll.closingDate > new Date())
    return res.status(403).send('Poll still open');

  res.json(poll.options);
});

//  Get a single poll by ID — must be last to avoid catching /closed or /results
router.get('/:pollId', authMiddleware, async (req, res) => {
  const poll = await Poll.findById(req.params.pollId);
  if (!poll) return res.status(404).json({ error: 'Poll not found' });
  res.json(poll);
});

module.exports = router;
