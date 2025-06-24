# poll-voting-app :-A full-stack web application where admins can create and manage polls, and users can vote once per poll. Once a poll is closed, users who have voted can view the results. The app demonstrates user-role-based access, full CRUD operations, and secure authentication.


Project Setup and Installation Instructions:
Folder Structure 
  /frontend   → React client app
  /backend    → Node.js + Express API

Prerequisites: 
  Node.js and npm installed
  MongoDB instance running (local or cloud like MongoDB Atlas)

Backend Setup (Node.js + Express)
1. Open terminal and go to the backend folder:
   cd backend

2. Install dependencies:
   npm install
   
4. Create a .env file:
   MONGO_URI=your_mongodb_connection_string ,
   JWT_SECRET=your_secret_key
   
5. Start the backend server:
   npx nodemon server.js


Frontend Setup
1. Go to the Main directory:
   cd..

2. create react app inside frontend dir:
   npm create vite@latest frontend -- --template react

3. Go to the Frontend dir:
   cd frontend

4. Install dependencies:
   npm install

5. Start the frontend server:
   npm run dev



Technologies Used and Why
React.js:-	 Frontend UI framework – fast, reusable component-based structure
Redux:-	 Manages global app state (user authentication, role-based access, etc.)
Node.js:-	 JavaScript runtime environment for backend
Express.js:- 	Minimal and flexible backend framework for API routing
MongoDB:- 	NoSQL database for storing polls, users, votes
JWT:-  (jsonwebtoken)	For secure user authentication and session management
bcryptjs:-	To securely hash user passwords
Axios:-	 For HTTP requests from frontend to backend
React:-  Router	To handle frontend routing and navigation
Tailwind CSS / Inline CSS:- 	For responsive and clean UI without external CSS files




API endpoints list with HTTP method, route, and purpose:-
//For SignUp

router.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashed, role });
  console.log(user);
  await user.save();
  res.send('User registered');
});

//For Login

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).send('Invalid credentials');
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).send('Invalid credentials');
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
  res.json({ token, role: user.role });
});



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





Link to your deployed application:-
https://poll-voting-app-gf79.vercel.app/

