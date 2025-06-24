# poll-voting-app :-A full-stack web application where admins can create and manage polls, and users can vote once per poll. Once a poll is closed, users who have voted can view the results. The app demonstrates user-role-based access, full CRUD operations, and secure authentication.


Project Setup and Installation Instructions:
Folder Structure 
  /frontend   → React client app
  /backend    → Node.js + Express API

Prerequisites
  Node.js and npm installed
  MongoDB instance running (local or cloud like MongoDB Atlas)

Backend Setup (Node.js + Express)
1. Open terminal and go to the backend folder
   cd backend

2. Install dependencies:
   npm install
   
4. Create a .env file:
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   
5. Start the backend server
   npx nodemon server.js


Frontend Setup
1. Go to the Main directory
   cd..

2. create react app inside frontend dir
   npm create vite@latest frontend -- --template react

3. Go to the Frontend dir
   cd frontend

4. Install dependencies:
   npm install

5. Start the frontend server
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
router.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashed, role });
  console.log(user);
  await user.save();
  res.send('User registered');
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).send('Invalid credentials');
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).send('Invalid credentials');
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
  res.json({ token, role: user.role });
});

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

// View results BY admin
router.get('/admin/all', authMiddleware, async (req, res) => {
  console.log("Inside /admin/all");
  const poll = await Poll.find();
  res.json(poll);
});

// Get open polls by id
router.get('/:pollId', authMiddleware, async (req, res) => {
  const polls = await Poll.findById(req.params.pollId);
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





Link to your deployed application:-
https://poll-voting-app-gf79.vercel.app/

