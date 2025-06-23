import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

const PollVotePage = () => {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const res = await API.get(`/polls`);
        const found = res.data.find((p) => p._id === id);
        if (found) setPoll(found);
        else alert('Poll not found');
      } catch (err) {
        alert('Error fetching poll');
      }
    };
    fetchPoll();
  }, [id]);

  const handleVote = async () => {
    if (selectedOption === null) return alert('Please select an option');
    try {
      await API.post(`/polls/vote/${id}`, { optionIndex: selectedOption });
      alert('Vote submitted');
      navigate(`/results/${id}`);
    } catch (err) {
      alert(err.response?.data || 'Vote failed');
    }
  };

  if (!poll) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">{poll.question}</h2>
      <ul className="space-y-2">
        {poll.options.map((opt, idx) => (
          <li key={idx} className="flex items-center space-x-2">
            <input
              type="radio"
              name="option"
              value={idx}
              onChange={() => setSelectedOption(idx)}
              className="mr-2"
            />
            <label>{opt.text}</label>
          </li>
        ))}
      </ul>
      <button
        onClick={handleVote}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        Submit Vote
      </button>
    </div>
  );
};

export default PollVotePage;
