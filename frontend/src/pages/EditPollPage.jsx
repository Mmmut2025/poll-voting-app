import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../services/api';

const EditPollPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [closingDate, setClosingDate] = useState('');

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const res = await API.get(`/polls/${id}`);
        const poll = res.data;
        setQuestion(poll.question);
        setOptions(poll.options.map(option => option.text));

        setClosingDate(new Date(poll.closingDate).toISOString().slice(0, 16));
      } catch (err) {
        alert('Failed to load poll');
      }
    };
    fetchPoll();
  }, [id]);

  const handleOptionChange = (value, index) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/polls/${id}`, {
        question,
         options: options.filter(opt => opt.trim()).map(opt => ({ text: opt })),
        closingDate,
      });
      alert('Poll updated successfully');
      navigate('/dashboard');
    } catch (err) {
      alert('Failed to update poll because you are not authorized');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this poll?')) {
      try {
        await API.delete(`/polls/${id}`);
        alert('Poll deleted successfully');
        navigate('/dashboard');
      } catch (err) {
        alert('Failed to delete poll because you are not authorized');
      }
    }
  };

  // Inline Styles
  const containerStyle = {
    maxWidth: '600px',
    margin: '40px auto',
    padding: '30px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
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

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginBottom: '10px',
  };

  const updateButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#16a34a', // green-600
    color: '#fff',
  };

  const deleteButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#dc2626', // red-600
    color: '#fff',
  };

  const addOptionStyle = {
    padding: '10px 16px',
    backgroundColor: '#6b7280', // gray-500
    color: '#fff',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginBottom: '12px',
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Edit Poll</h2>
      <form onSubmit={handleUpdate}>
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
        <button type="button" onClick={addOption} style={addOptionStyle}>
          + Add Option
        </button>
        <input
          type="datetime-local"
          value={closingDate}
          onChange={(e) => setClosingDate(e.target.value)}
          style={inputStyle}
          required
        />
        <button type="submit" style={updateButtonStyle}>
          Update Poll
        </button>
      </form>
      <button onClick={handleDelete} style={deleteButtonStyle}>
        Delete Poll
      </button>
    </div>
  );
};

export default EditPollPage;
