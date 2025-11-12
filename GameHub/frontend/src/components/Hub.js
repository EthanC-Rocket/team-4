import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Hub({ user, onLogout, token }) {
  const [scores, setScores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && token) {
      fetchScores();
    }
  }, [user, token]);

  const fetchScores = async () => {
    try {
      const response = await fetch('/api/scores', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setScores(data);
      }
    } catch (err) {
      console.error('Failed to fetch scores:', err);
    }
  };

  const games = [
    {
      name: 'Sudoku',
      path: '/game/sudoku',
      icon: '🔢',
      description: 'Classic number puzzle game'
    },
    {
      name: 'RocketMans',
      path: '/game/rocketmans',
      icon: '🚀',
      description: 'Navigate your rocket through space'
    },
    {
      name: 'Dungeon Crawler',
      path: '/game/dungeon',
      icon: '⚔️',
      description: 'Explore dungeons and fight monsters'
    },
    {
      name: 'Personality Quiz',
      path: '/game/personality-quiz',
      icon: '🧠',
      description: 'Discover your personality type'
    },
    {
      name: 'Would You Rather',
      path: '/game/would-you-rather',
      icon: '🤔',
      description: 'Make tough choices'
    }
  ];

  return (
    <div className="hub-container">
      {user && (
        <div className="sidebar">
          <h2>Your Scores</h2>
          {scores.length > 0 ? (
            scores.map((score, index) => (
              <div key={index} className="score-item">
                <h3>{score.game_name}</h3>
                <p>{score.score} points</p>
              </div>
            ))
          ) : (
            <p>No scores yet. Play some games!</p>
          )}
        </div>
      )}
      
      <div className="main-content">
        <div className="hub-header">
          <h1>🎮 GameHub</h1>
          {user ? (
            <div className="user-info">
              <p>Welcome, {user.username}!</p>
              <button className="logout-btn" onClick={onLogout}>Logout</button>
            </div>
          ) : (
            <div className="user-info">
              <Link to="/login">
                <button className="logout-btn">Login</button>
              </Link>
              {' '}
              <Link to="/register">
                <button className="logout-btn">Register</button>
              </Link>
            </div>
          )}
        </div>

        <div className="games-grid">
          {games.map((game, index) => (
            <div
              key={index}
              className="game-card"
              onClick={() => navigate(game.path)}
            >
              <div className="game-icon">{game.icon}</div>
              <h2>{game.name}</h2>
              <p>{game.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Hub;
