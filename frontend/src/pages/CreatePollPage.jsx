import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const CreatePollPage = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [closingDate, setClosingDate] = useState('');
  const navigate = useNavigate();

  const handleOptionChange = (value, index) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/polls', {
        question,
         options: options.filter(opt => opt.trim()).map(opt => ({ text: opt })),
        closingDate,
      });
      alert('Poll created successfully');
      navigate('/dashboard');
    } catch (err) {
      alert('Failed to create poll');
    }
  };

  // Inline styles
  const containerStyle = {
    padding: '30px',
    maxWidth: '600px',
    margin: '40px auto',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  };

  const headingStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    marginBottom: '12px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  };

  const addButtonStyle = {
    padding: '10px 16px',
    backgroundColor: '#6b7280', // gray-500
    color: '#fff',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginBottom: '10px',
  };

  const submitButtonStyle = {
    padding: '12px',
    backgroundColor: '#2563eb', // blue-600
    color: '#fff',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '6px',
    width: '100%',
    cursor: 'pointer',
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Create Poll</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Poll Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          style={inputStyle}
          required
        />
        {options.map((opt, idx) => (
          <input
            key={idx}
            type="text"
            placeholder={`Option ${idx + 1}`}
            value={opt}
            onChange={(e) => handleOptionChange(e.target.value, idx)}
            style={inputStyle}
            required
          />
        ))}
        <button type="button" onClick={addOption} style={addButtonStyle}>
          + Add Option
        </button>
        <input
          type="datetime-local"
          value={closingDate}
          onChange={(e) => setClosingDate(e.target.value)}
          style={inputStyle}
          required
        />
        <button type="submit" style={submitButtonStyle}>
          Create Poll
        </button>
      </form>
    </div>
  );
};

export default CreatePollPage;
