import { useEffect, useState } from 'react';
import API from '../services/api';

const PollListResults = () => {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    const fetchClosedPolls = async () => {
      try {
        const res = await API.get('/polls/closed');
        setPolls(res.data);
      } catch (err) {
  console.error('Fetch error:', err.response?.data || err.message);
  if (err.response?.status === 401) {
    alert('Unauthorized: Please login to view poll results');
  } else {
    alert('Unable to fetch closed polls');
  }
}
    };

    fetchClosedPolls();
  }, []);

  const containerStyle = {
    padding: '30px',
    maxWidth: '800px',
    margin: '40px auto',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  };

  const pollStyle = {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '24px',
    backgroundColor: '#fff',
  };

  const optionStyle = {
    marginBottom: '10px',
    fontWeight: 500,
    display: 'flex',
    justifyContent: 'space-between',
  };

  const barContainerStyle = {
    width: '100%',
    height: '8px',
    backgroundColor: '#eee',
    borderRadius: '4px',
    marginTop: '6px',
  };

  const barStyle = (votes) => ({
    width: `${votes * 10}px`,
    height: '8px',
    backgroundColor: '#3b82f6',
    borderRadius: '4px',
  });

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '24px' }}>
        Closed Poll Results 
      </h2>

      {polls.map((poll) => (
        <div key={poll._id} style={pollStyle}>
          <h3>{poll.question}</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {poll.options.map((opt, idx) => (
              <li key={idx}>
                <div style={optionStyle}>
                  <span>{opt.text}</span>
                  <span>{opt.votes} votes</span>
                </div>
                <div style={barContainerStyle}>
                  <div style={barStyle(opt.votes)}></div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default PollListResults;
