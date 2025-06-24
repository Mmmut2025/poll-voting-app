import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import CreatePollPage from './pages/CreatePollPage';
import PollListPage from './pages/PollListPage';
import PollVotePage from './pages/PollVotePage';
import ResultPage from './pages/PollListResults';
import Navbar from './components/Navbar';
import ManagePollsPage from './pages/ManagePollsPage';
import EditPollPage from './pages/EditPollPage';
import PollListResults from './pages/PollListResults';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-poll" element={<CreatePollPage />} />
        <Route path="/polls" element={<PollListPage />} />
        <Route path="/poll/:id" element={<PollVotePage />} />
        <Route path="/results/:id" element={<PollListResults />} />
        <Route path="/polls/manage" element={<ManagePollsPage />} /> 
        <Route path="/polls/edit/:id" element={<EditPollPage />} />
        <Route path="/polls/closed" element={<PollListResults />}/>
      </Routes>
    </>
  );
}

export default App;