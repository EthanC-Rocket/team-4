import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import adImg from './games/Images/ad.png';
import './Hub.css';
function Hub({ user, onLogout, token }) {
  const [scores, setScores] = useState([]);
  const [showAd, setShowAd] = useState(true);
  const navigate = useNavigate();
  const handleCloseAd = () => {
    setShowAd(false);
  };

  useEffect(() => {
    if (user && token) {
      fetchScores();
    }
  }, [user, token]);

  const fetchScores = async () => {
    try {
      console.log('Fetching scores for user:', user?.username, 'with token:', token ? 'present' : 'missing');
      const response = await fetch('/api/scores', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      if (response.ok) {
        console.log('Setting scores:', data);
        setScores(data);
      } else {
        console.error('Failed to fetch scores:', response.status, data);
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
    },
    {
      name: 'Zork',
      path: '/game/zork',
      icon: '📜',
      description: 'Text adventure in classic D&D style'
    },
    {
      name: 'One Night At Rocket',
      path: '/game/one-night-at-rocket',
      icon: '👾',
      description: 'Survive the night at Rocket HQ!'
    },
    {
      name: 'ROCXS',
      path: '/game/rocxs',
      icon: '🪨',
      description: 'The ultimate ROCXS challenge!'
    }
  ];

  return (
    <div className="hub-container">
      {showAd && (
        <div className="hub-ad-modal">
          <img src={adImg} alt="Ad" className="hub-ad-image" />
          <button className="hub-ad-close" onClick={handleCloseAd}>X</button>
        </div>
      )}
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

