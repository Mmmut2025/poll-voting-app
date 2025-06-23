import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Inline styles
  const containerStyle = {
    padding: '30px',
    maxWidth: '600px',
    margin: '40px auto',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    textAlign: 'center',
  };

  const headingStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '30px',
  };

  const buttonStyle = {
    padding: '12px 20px',
    fontSize: '16px',
    fontWeight: 'bold',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    color: '#fff',
    marginTop: '10px',
    marginRight: '10px',
  };

  const createButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#2563eb', // blue
  };

  const manageButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#9333ea', // purple
  };

  const voteButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#16a34a', // green
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Welcome, {user?.email}</h2>

      {user?.role === 'Admin' ? (
        <div>
          <button
            style={createButtonStyle}
            onClick={() => navigate('/create-poll')}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#1d4ed8')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#2563eb')}
          >
            Create New Poll
          </button>
          <button
            style={manageButtonStyle}
            onClick={() => navigate('/polls/manage')}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#7e22ce')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#9333ea')}
          >
            Manage Polls
          </button>
        </div>
      ) : (
        <button
          style={voteButtonStyle}
          onClick={() => navigate('/polls')}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#15803d')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#16a34a')}
        >
          View & Vote on Polls
        </button>
      )}
    </div>
  );
};

export default Dashboard;
