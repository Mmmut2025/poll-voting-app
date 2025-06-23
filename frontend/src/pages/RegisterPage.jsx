import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/signup', { name, email, password, role });
      alert('Registered successfully');
      navigate('/');
    } catch (err) {
      alert('Registration failed');
    }
  };

  // Inline styles
  const containerStyle = {
    padding: '20px',
    maxWidth: '400px',
    margin: '40px auto',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  };

  const titleStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    marginBottom: '15px',
    fontSize: '16px',
  };

  const buttonStyle = {
    width: '100%',
    backgroundColor: '#16a34a', // green-600
    color: 'white',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
  };

  const buttonHoverStyle = {
    backgroundColor: '#15803d', // green-700
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Name"
          style={inputStyle}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          style={inputStyle}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          style={inputStyle}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={inputStyle}
        >
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select>
        <button
          type="submit"
          style={buttonStyle}
          onMouseOver={(e) => Object.assign(e.target.style, buttonHoverStyle)}
          onMouseOut={(e) => Object.assign(e.target.style, buttonStyle)}
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
