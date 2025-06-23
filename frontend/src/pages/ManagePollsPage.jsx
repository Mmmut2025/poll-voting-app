import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const ManagePollsPage = () => {
  const [polls, setPolls] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const res = await API.get('/polls/admin');
      setPolls(res.data);
    } catch (err) {
      alert('Failed to load polls');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this poll?')) {
      try {
        await API.delete(`/polls/${id}`);
        fetchPolls();
        alert('Poll deleted');
      } catch (err) {
        alert('Failed to delete poll');
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/polls/edit/${id}`);
  };

  // Inline styles
  const containerStyle = {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '20px',
    backgroundColor: '#f3f4f6',
    borderRadius: '8px',
  };

  const cardStyle = {
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '6px',
    padding: '16px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  const headingStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '20px',
  };

  const titleStyle = {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '8px',
  };

  const dateStyle = {
    fontSize: '14px',
    color: '#555',
    marginBottom: '12px',
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '10px',
  };

  const editButtonStyle = {
    padding: '8px 12px',
    backgroundColor: '#f59e0b',
    color: '#fff',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  };

  const deleteButtonStyle = {
    padding: '8px 12px',
    backgroundColor: '#ef4444',
    color: '#fff',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Manage Polls</h2>
      {polls.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No polls found.</p>
      ) : (
        polls.map((poll) => (
          <div key={poll._id} style={cardStyle}>
            <h3 style={titleStyle}>{poll.question}</h3>
            <p style={dateStyle}>
              Closes At: {new Date(poll.closingDate).toLocaleString()}
            </p>
            <div style={buttonContainerStyle}>
              <button style={editButtonStyle} onClick={() => handleEdit(poll._id)}>
                Edit
              </button>
              <button
                style={deleteButtonStyle}
                onClick={() => handleDelete(poll._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ManagePollsPage;
