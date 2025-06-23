import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';

const ResultPage = () => {
  const { id } = useParams();
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await API.get(`/polls/results/${id}`);
        console.log(res);
        setResults(res.data);
      } catch (err) {
        alert('Unable to load results');
      }
    };
    fetchResults();
  }, [id]);

  // Inline Styles
  const containerStyle = {
    padding: '30px',
    maxWidth: '600px',
    margin: '40px auto',
    borderRadius: '8px',
    backgroundColor: '#f4f4f4',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  };

  const headingStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center',
  };

  const listItemStyle = {
    border: '1px solid #ccc',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '12px',
    backgroundColor: '#fff',
  };

  const barContainerStyle = {
    width: '100%',
    backgroundColor: '#e5e5e5',
    borderRadius: '4px',
    height: '8px',
    marginTop: '6px',
  };

  const barStyle = (votes) => ({
    width: `${Math.max(votes * 10, 4)}px`, // prevent too small bars
    backgroundColor: '#3b82f6',
    height: '8px',
    borderRadius: '4px',
  });

  const rowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '16px',
    fontWeight: '500',
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Poll Results</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {results.map((opt, idx) => (
          <li key={idx} style={listItemStyle}>
            <div style={rowStyle}>
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
  );
};

export default ResultPage;
