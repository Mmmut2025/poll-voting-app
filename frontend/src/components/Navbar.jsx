import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navStyle = {
    background: 'linear-gradient(to right, #4338ca, #6b21a8, #db2777)',
    color: 'white',
    position: 'sticky',
    top: 0,
    zIndex: 50,
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '16px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    alignItems: 'center',
    justifyContent: 'space-between',

    // Media query: if window width > 768px, change flex direction
    ...(window.innerWidth >= 768 && {
      flexDirection: 'row',
      gap: 0,
    }),
  };

  const buttonStyle = {
    padding: '10px 16px',
    borderRadius: '8px',
    fontWeight: '600',
    backgroundColor: '#4f46e5',
    color: 'white',
    marginRight: '12px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };

  const hoverButton = {
    backgroundColor: 'white',
    color: '#4f46e5',
  };

  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        <h1
          onClick={() => navigate('/dashboard')}
          style={{
            fontSize: '28px',
            fontWeight: '800',
            cursor: 'pointer',
            color: 'white',
          }}
        >
          🗳️ Poll & Voting App
        </h1>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
          {user ? (
            <>
              {user.role === 'Admin' && (
                <Link
                  to="/create-poll"
                  style={{ ...buttonStyle }}
                  onMouseOver={(e) => Object.assign(e.target.style, hoverButton)}
                  onMouseOut={(e) => Object.assign(e.target.style, buttonStyle)}
                >
                  Create Poll
                </Link>
              )}
              {user.role === 'User' && (
                <Link
                  to="/polls"
                  style={{ ...buttonStyle }}
                  onMouseOver={(e) => Object.assign(e.target.style, hoverButton)}
                  onMouseOut={(e) => Object.assign(e.target.style, buttonStyle)}
                >
                  Vote Polls
                </Link>
              )}
              <button
                onClick={handleLogout}
                style={{ ...buttonStyle, backgroundColor: '#dc2626' }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = '#b91c1c')
                }
                onMouseOut={(e) =>
                  (e.target.style.backgroundColor = '#dc2626')
                }
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/"
                style={{ ...buttonStyle }}
                onMouseOver={(e) => Object.assign(e.target.style, hoverButton)}
                onMouseOut={(e) => Object.assign(e.target.style, buttonStyle)}
              >
                Login
              </Link>
              <Link
                to="/register"
                style={{ ...buttonStyle }}
                onMouseOver={(e) => Object.assign(e.target.style, hoverButton)}
                onMouseOut={(e) => Object.assign(e.target.style, buttonStyle)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
