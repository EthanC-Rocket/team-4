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

  return (
    <div className="game-container">
      <button className="back-btn" onClick={() => navigate('/')}>← Back to Hub</button>
      
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
        )}
      </div>
    </div>
  );
}

export default WouldYouRather;
