import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PersonalityQuiz.css';

function PersonalityQuiz({ user, token }) {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);

  const questions = [
    {
      id: 1,
      question: "How do you prefer to spend your free time?",
      options: [
        { text: "Reading a book or learning something new", type: "Intellectual" },
        { text: "Hanging out with friends", type: "Social" },
        { text: "Working on a creative project", type: "Creative" },
        { text: "Exercising or being outdoors", type: "Active" }
      ]
    },
    {
      id: 2,
      question: "When facing a problem, you tend to:",
      options: [
        { text: "Analyze it logically and systematically", type: "Intellectual" },
        { text: "Discuss it with others to get different perspectives", type: "Social" },
        { text: "Think outside the box for unique solutions", type: "Creative" },
        { text: "Take immediate action", type: "Active" }
      ]
    },
    {
      id: 3,
      question: "What describes your ideal vacation?",
      options: [
        { text: "Visiting museums and historical sites", type: "Intellectual" },
        { text: "Meeting new people and experiencing local culture", type: "Social" },
        { text: "Exploring art galleries and attending performances", type: "Creative" },
        { text: "Hiking, diving, or adventure sports", type: "Active" }
      ]
    },
    {
      id: 4,
      question: "In a group project, you usually:",
      options: [
        { text: "Research and provide detailed information", type: "Intellectual" },
        { text: "Coordinate and communicate with team members", type: "Social" },
        { text: "Come up with innovative ideas", type: "Creative" },
        { text: "Take charge and get things done", type: "Active" }
      ]
    },
    {
      id: 5,
      question: "What motivates you the most?",
      options: [
        { text: "Knowledge and understanding", type: "Intellectual" },
        { text: "Connections and relationships", type: "Social" },
        { text: "Self-expression and originality", type: "Creative" },
        { text: "Achievement and results", type: "Active" }
      ]
    },
    {
      id: 6,
      question: "Your workspace is usually:",
      options: [
        { text: "Organized with books and references", type: "Intellectual" },
        { text: "Decorated with photos of friends and family", type: "Social" },
        { text: "Colorful and inspiring", type: "Creative" },
        { text: "Minimal and functional", type: "Active" }
      ]
    },
    {
      id: 7,
      question: "When learning something new, you prefer to:",
      options: [
        { text: "Read detailed instructions and theory", type: "Intellectual" },
        { text: "Learn from others in a group setting", type: "Social" },
        { text: "Experiment and find your own way", type: "Creative" },
        { text: "Jump in and learn by doing", type: "Active" }
      ]
    },
    {
      id: 8,
      question: "What kind of movie do you enjoy most?",
      options: [
        { text: "Documentaries and thought-provoking dramas", type: "Intellectual" },
        { text: "Romantic comedies and feel-good films", type: "Social" },
        { text: "Artistic and visually stunning films", type: "Creative" },
        { text: "Action and adventure movies", type: "Active" }
      ]
    }
  ];

  const personalityTypes = {
    Intellectual: {
      name: "The Thinker",
      description: "You're analytical, curious, and love to learn. You approach life with logic and reason, always seeking to understand the 'why' behind things.",
      traits: ["Analytical", "Curious", "Logical", "Knowledge-seeking"]
    },
    Social: {
      name: "The Connector",
      description: "You thrive on relationships and social interactions. You're empathetic, communicate well, and find joy in bringing people together.",
      traits: ["Empathetic", "Communicative", "Collaborative", "People-oriented"]
    },
    Creative: {
      name: "The Artist",
      description: "You see the world through a unique lens and express yourself creatively. Innovation and originality are your strengths.",
      traits: ["Imaginative", "Original", "Expressive", "Innovative"]
    },
    Active: {
      name: "The Doer",
      description: "You're action-oriented and practical. You prefer hands-on experiences and get energized by accomplishing tasks and overcoming challenges.",
      traits: ["Energetic", "Practical", "Results-driven", "Adventurous"]
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
  };

  const handleAnswer = (type) => {
    const newAnswers = { ...answers };
    newAnswers[type] = (newAnswers[type] || 0) + 1;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = async (finalAnswers) => {
    let maxCount = 0;
    let dominantType = '';

    for (let type in finalAnswers) {
      if (finalAnswers[type] > maxCount) {
        maxCount = finalAnswers[type];
        dominantType = type;
      }
    }

    const personalityResult = personalityTypes[dominantType];
    setResult(personalityResult);

    // Calculate score based on consistency
    const score = maxCount * 20;

    if (user && token) {
      try {
        await fetch('/api/scores', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            game_name: 'Personality Quiz',
            score: score,
            metadata: personalityResult.name
          })
        });
      } catch (err) {
        console.error('Failed to submit score:', err);
      }
    }
  };

  return (
    <div className="game-container">
      <button className="back-btn" onClick={() => navigate('/')}>← Back to Hub</button>
      
      <div className="game-header">
        <h1>🧠 Personality Quiz</h1>
      </div>

      <div className="game-content">
        {!quizStarted ? (
          <div className="quiz-start">
            <h2>Discover Your Personality Type</h2>
            <p>Answer 8 questions to find out what kind of person you are!</p>
            <button onClick={startQuiz} className="start-btn">Start Quiz</button>
          </div>
        ) : result ? (
          <div className="quiz-result">
            <h2>Your Personality Type:</h2>
            <h3>{result.name}</h3>
            <p className="result-description">{result.description}</p>
            <div className="traits">
              <h4>Your Traits:</h4>
              <div className="trait-list">
                {result.traits.map((trait, index) => (
                  <span key={index} className="trait-badge">{trait}</span>
                ))}
              </div>
            </div>
            <button onClick={startQuiz} className="start-btn">Take Quiz Again</button>
          </div>
        ) : (
          <div className="quiz-question">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
            <p className="question-number">Question {currentQuestion + 1} of {questions.length}</p>
            <h3>{questions[currentQuestion].question}</h3>
            <div className="options">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  className="option-btn"
                  onClick={() => handleAnswer(option.type)}
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PersonalityQuiz;
