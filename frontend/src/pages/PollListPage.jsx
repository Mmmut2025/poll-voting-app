import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const PollListPage = () => {
  const [polls, setPolls] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const res = await API.get('/polls');
        setPolls(res.data);
      } catch (err) {
        alert('Failed to load polls');
      }
    };
    fetchPolls();
  }, []);

  // Styles
  const containerStyle = {
    padding: '30px',
    maxWidth: '700px',
    margin: '40px auto',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  };

  const headingStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center',
    color: '#1f2937',
  };

  const listStyle = {
    listStyle: 'none',
    padding: 0,
  };

  const itemStyle = {
    padding: '16px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    marginBottom: '12px',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  };

  const itemHoverStyle = {
    backgroundColor: '#f3f4f6',
  };

  const questionStyle = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '6px',
  };

  const dateStyle = {
    fontSize: '14px',
    color: '#6b7280',
  };

  // Render
  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Available Polls</h2>
      {polls.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#6b7280' }}>No open polls found.</p>
      ) : (
        <ul style={listStyle}>
          {polls.map((poll) => (
            <li
              key={poll._id}
              style={itemStyle}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
              onClick={() => navigate(`/poll/${poll._id}`)}
            >
              <h3 style={questionStyle}>{poll.question}</h3>
              <p style={dateStyle}>
                Closes on: {new Date(poll.closingDate).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PollListPage;
