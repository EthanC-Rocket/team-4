<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './WouldYouRather.css';

const API_URL = 'http://127.0.0.1:8000';
const TOKEN = 'carol-secret-token'; // Replace with your actual token logic

function WouldYouRather() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [voted, setVoted] = useState(false);

  const [showAdd, setShowAdd] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ option1: '', option2: '', category: '' });
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState('');

  useEffect(() => {
    fetchQuestion();
  }, []);


  const fetchQuestion = async () => {
    setLoading(true);
    setError('');
    setVoted(false);
    try {
      const res = await axios.get(`${API_URL}/questions/random`, {
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
        `${API_URL}/questions/${question.id}/upvote?option=${option}`,
        {},
        { headers: { token: TOKEN } }
      );
      // Fetch updated question to get new vote counts
      const res = await axios.get(`${API_URL}/questions/${question.id}`, {
        headers: { token: TOKEN }
      });
      setQuestion(res.data);
      setVoted(true);
    } catch (err) {
      setError('Could not register vote.');
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    setAddError('');
    setAddSuccess('');
    if (!newQuestion.option1 || !newQuestion.option2 || !newQuestion.category) {
      setAddError('All fields are required.');
      return;
    }
    try {
      await axios.post(
        `${API_URL}/questions`,
        newQuestion,
        { headers: { token: TOKEN } }
      );
      setAddSuccess('Question added successfully!');
  setNewQuestion({ option1: '', option2: '', category: '' });
    } catch (err) {
      setAddError('Could not add question.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!question) return <div>No question found.</div>;

=======
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WouldYouRather.css';

function WouldYouRather({ user, token }) {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      id: 1,
      optionA: "Have the ability to fly",
      optionB: "Have the ability to become invisible"
    },
    {
      id: 2,
      optionA: "Always be 10 minutes late",
      optionB: "Always be 20 minutes early"
    },
    {
      id: 3,
      optionA: "Be able to speak all languages",
      optionB: "Be able to talk to animals"
    },
    {
      id: 4,
      optionA: "Live without music",
      optionB: "Live without movies"
    },
    {
      id: 5,
      optionA: "Have unlimited money",
      optionB: "Have unlimited time"
    },
    {
      id: 6,
      optionA: "Never use social media again",
      optionB: "Never watch another movie or TV show"
    },
    {
      id: 7,
      optionA: "Be the funniest person in the room",
      optionB: "Be the smartest person in the room"
    },
    {
      id: 8,
      optionA: "Travel to the past",
      optionB: "Travel to the future"
    },
    {
      id: 9,
      optionA: "Have a personal chef",
      optionB: "Have a personal driver"
    },
    {
      id: 10,
      optionA: "Live in a world without problems",
      optionB: "Live in a world where you're the only one who can solve problems"
    }
  ];

  const startGame = () => {
    setGameStarted(true);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setShowResults(false);
  };

  const handleChoice = (choice) => {
    const newAnswers = [...answers, { questionId: questions[currentQuestionIndex].id, choice }];
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finishGame(newAnswers);
    }
  };

  const finishGame = async (finalAnswers) => {
    setShowResults(true);
    
    // Calculate score based on completion
    const score = finalAnswers.length * 10;

    if (user && token) {
      try {
        await fetch('/api/scores', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            game_name: 'Would You Rather',
            score: score,
            metadata: `Completed ${finalAnswers.length} questions`
          })
        });
      } catch (err) {
        console.error('Failed to submit score:', err);
      }
    }
  };

  const getPersonalityInsight = () => {
    const choiceA = answers.filter(a => a.choice === 'A').length;
    const choiceB = answers.filter(a => a.choice === 'B').length;

    if (choiceA > choiceB) {
      return {
        title: "The Adventurer",
        description: "You tend to choose options that offer excitement and new experiences. You're bold and willing to take risks!"
      };
    } else if (choiceB > choiceA) {
      return {
        title: "The Pragmatist",
        description: "You make practical choices that consider long-term benefits. You're thoughtful and strategic in your decisions!"
      };
    } else {
      return {
        title: "The Balanced One",
        description: "You're perfectly balanced in your choices, considering both adventure and practicality. You adapt well to different situations!"
      };
    }
  };
>>>>>>> 7c855b81c2c083dab2aa4f7b6aab87b38926a5ad

  return (
    <div className="game-container">
      <button className="back-btn" onClick={() => navigate('/')}>← Back to Hub</button>
<<<<<<< HEAD
      <div className="game-header">
        <h1>🤔 Would You Rather</h1>
      </div>
      <div className="game-content">
        <div className="wyr-question">
          <h2>Would You Rather...</h2>
          <div className="choices">
            <button 
              className="choice-btn choice-a"
              onClick={() => handleVote(1)}
              disabled={voted}
            >
              <span className="choice-label">A</span>
              <span className="choice-text">{question.option1}</span>
            </button>
            <div className="or-divider">OR</div>
            <button 
              className="choice-btn choice-b"
              onClick={() => handleVote(2)}
              disabled={voted}
            >
              <span className="choice-label">B</span>
              <span className="choice-text">{question.option2}</span>
            </button>
          </div>
          <div>Category: <b>{question.category}</b></div>
          {voted && (
            <div style={{ marginTop: '30px' }}>
              <div style={{ color: 'green', marginBottom: '20px' }}>Thanks for voting!</div>
              <div style={{ marginBottom: '10px' }}>
                <b>A:</b> {question.option1Votes} votes
              </div>
              <div style={{ marginBottom: '10px' }}>
                <b>B:</b> {question.option2Votes} votes
              </div>
            </div>
          )}
          <button onClick={fetchQuestion} style={{ marginTop: '30px', padding: '8px 16px' }}>Next Question</button>
        </div>
        <hr style={{ margin: '40px 0' }} />
        <button onClick={() => setShowAdd(!showAdd)} style={{ marginBottom: '20px', padding: '8px 16px' }}>
          {showAdd ? 'Hide Add Question' : 'Add a New Question'}
        </button>
        {showAdd && (
          <form onSubmit={handleAddQuestion} style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'left' }}>
            <div style={{ marginBottom: '10px' }}>
              <label>Option 1:</label>
              <input
                type="text"
                value={newQuestion.option1}
                onChange={e => setNewQuestion({ ...newQuestion, option1: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Option 2:</label>
              <input
                type="text"
                value={newQuestion.option2}
                onChange={e => setNewQuestion({ ...newQuestion, option2: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Category:</label>
              <input
                type="text"
                value={newQuestion.category}
                onChange={e => setNewQuestion({ ...newQuestion, category: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
            <button type="submit" style={{ padding: '8px 16px' }}>Submit</button>
            {addError && <div style={{ color: 'red', marginTop: '10px' }}>{addError}</div>}
            {addSuccess && <div style={{ color: 'green', marginTop: '10px' }}>{addSuccess}</div>}
          </form>
=======
      
      <div className="game-header">
        <h1>🤔 Would You Rather</h1>
      </div>

      <div className="game-content">
        {!gameStarted ? (
          <div className="wyr-start">
            <h2>Make Your Choices</h2>
            <p>Answer {questions.length} 'Would You Rather' questions and see what they say about you!</p>
            <button onClick={startGame} className="start-btn">Start Game</button>
          </div>
        ) : showResults ? (
          <div className="wyr-results">
            <h2>Your Results</h2>
            <div className="personality-result">
              <h3>{getPersonalityInsight().title}</h3>
              <p>{getPersonalityInsight().description}</p>
            </div>
            
            <div className="answer-summary">
              <h4>Your Choices:</h4>
              {answers.map((answer, index) => (
                <div key={index} className="answer-item">
                  <span className="question-num">Q{answer.questionId}:</span>
                  <span className="choice-label">Option {answer.choice}</span>
                  <span className="choice-text">
                    {answer.choice === 'A' 
                      ? questions[answer.questionId - 1].optionA 
                      : questions[answer.questionId - 1].optionB}
                  </span>
                </div>
              ))}
            </div>

            <button onClick={startGame} className="start-btn">Play Again</button>
          </div>
        ) : (
          <div className="wyr-question">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
            <p className="question-number">Question {currentQuestionIndex + 1} of {questions.length}</p>
            
            <h2>Would You Rather...</h2>
            
            <div className="choices">
              <button 
                className="choice-btn choice-a"
                onClick={() => handleChoice('A')}
              >
                <span className="choice-label">A</span>
                <span className="choice-text">{questions[currentQuestionIndex].optionA}</span>
              </button>

              <div className="or-divider">OR</div>

              <button 
                className="choice-btn choice-b"
                onClick={() => handleChoice('B')}
              >
                <span className="choice-label">B</span>
                <span className="choice-text">{questions[currentQuestionIndex].optionB}</span>
              </button>
            </div>
          </div>
>>>>>>> 7c855b81c2c083dab2aa4f7b6aab87b38926a5ad
        )}
      </div>
    </div>
  );
}

export default WouldYouRather;
