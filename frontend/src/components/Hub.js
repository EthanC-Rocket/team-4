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
      name: 'ROCXS',
      path: '/game/rocxs',
      icon: '🪨',
      description: 'The ultimate ROCXS challenge!'
    },
    {
      name: 'Matrix Sudoku',
      path: '/game/sudoku',
      icon: '⚡',
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
      name: 'Athlete Personality Quiz',
      path: '/game/personality-quiz',
      icon: '🏃‍♂️',
      description: 'Discover your athletic personality'
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
      name: 'Pet Rock Battler',
      path: '/',
      icon: '🐲',
      description: 'Summon pet Rocks to fight other peoples pet rocks'
    },
    {
      name: 'Trivianado',
      path: '/',
      icon: '🌪️',
      description: 'Extreme Trivia Challenge'
    },
     {
      name: 'SWaB Battlegrounds',
      path: '/',
      icon: '📍',
      description: 'Fight as a SWaB in a battle royale'
    },
     {
      name: 'One Night At Rocket',
      path: '/game/one-night-at-rocket',
      icon: '👾',
      description: 'Survive the night at Rocket HQ!'
    },
     {
      name: 'Cornucopia Clash',
      path: '/',
      icon: '💥',
      description: 'Long awaited sequel to the hit game Cornucopia'
    },
  ];

  return (
    <div className="hub-container">
      {showAd && (
        <div className="hub-ad-modal">
          <img src={adImg} alt="Ad" className="hub-ad-image" />
          <button className="hub-ad-close" onClick={handleCloseAd}>X</button>
        </div>
      )}
      <div className="sidebar">
       {user ? (
            <div className="user-info">
              <p>Welcome, {user.username}!</p>
              <button className="logout-btn" onClick={onLogout}>Logout</button>
            </div>
          ) : (
            <div className="user-info">
                <p>Welcome, Guest!</p>
              <Link to="/login">
                <button className="logout-btn">Login</button>
              </Link>
              {' '}
              <Link to="/register">
                <button className="logout-btn">Register</button>
              </Link>
            </div>
          )}
      {user && (
        <>
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
        </>
      )}
      {user ? (<></>
          ) : (<>
            <div className="user-info">
                <p>Register to record your scores!</p>
            </div>
            <div>
                 <img src={adImg} alt="Ad" style={{ width: '225px' }} className="hub-ad-image" />
              </div>
              </>
          )}
      </div>
      
      <div className="main-content">
        <div className="hub-header">
          <h1> Boulder Arcade</h1>
          <h2> Where you find games that rock</h2>
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

