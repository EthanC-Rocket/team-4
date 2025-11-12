import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/questions/random';
const TOKEN = 'mysecrettoken'; // Replace with your actual token logic

function WouldYouRatherGame() {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    fetchQuestion();
  }, []);

  const fetchQuestion = async () => {
    setLoading(true);
    setError('');
    setVoted(false);
    try {
      const res = await axios.get(API_URL, {
        headers: { token: TOKEN }
      });
      setQuestion(res.data);
    } catch (err) {
      setError('Could not fetch question.');
    }
    setLoading(false);
  };

  const handleVote = async (option) => {
    if (!question) return;
    try {
      await axios.post(
        `http://127.0.0.1:8000/questions/${question.id}/upvote?option=${option}`,
        {},
        { headers: { token: TOKEN } }
      );
      setVoted(true);
    } catch (err) {
      setError('Could not register vote.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!question) return <div>No question found.</div>;

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Would You Rather...</h2>
      <div style={{ margin: '20px 0', fontSize: '1.3em' }}>
        <button onClick={() => handleVote(1)} disabled={voted} style={{ marginRight: '20px', padding: '10px 20px' }}>
          {question.option1}
        </button>
        <span style={{ fontWeight: 'bold', margin: '0 10px' }}>OR</span>
        <button onClick={() => handleVote(2)} disabled={voted} style={{ padding: '10px 20px' }}>
          {question.option2}
        </button>
      </div>
      <div>Category: <b>{question.category}</b></div>
      {voted && <div style={{ color: 'green', marginTop: '20px' }}>Thanks for voting!</div>}
      <button onClick={fetchQuestion} style={{ marginTop: '30px', padding: '8px 16px' }}>Next Question</button>
    </div>
  );
}

export default WouldYouRatherGame;
