import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Timer from './Timer';
import './GamePage.css';

function GamePage({ gameType }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { scenario } = location.state;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);
  const [finalGameScore, setFinalGameScore] = useState(0);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [resetTimer, setResetTimer] = useState(false);

  useEffect(() => {
    const gamePath = getGamePathByTitle(scenario.title);
    if (gameType !== gamePath) {
      navigate('/map');
    }
  }, [gameType, scenario, navigate]);

  const getGamePathByTitle = (title) => {
    const pathMap = {
      "The Party or the Pitfall?": "party",
      "One Puff, One Regret?": "smoking",
      "The Social Media Dare": "social-media",
      "Friend in Need, Friend Indeed?": "friendship",
      "The Unsupervised Weekend": "unsupervised",
      "The Test Stress": "test",
      "The Older Kid's Offer": "peer-pressure"
    };
    return pathMap[title] || 'default';
  };

  const currentQuestion = scenario.steps[currentQuestionIndex];

  const handleAnswer = (isCorrect) => {
    const storedScores = JSON.parse(localStorage.getItem('scores')) || {};
    let newScore = score;
    
    // Update score if answer is correct
    if (isCorrect) {
      newScore = score + 1;
      setScore(newScore);
    }

    // Check if scenario is already completed
    if (storedScores[scenario.title] === 100) {
      if (currentQuestionIndex < scenario.steps.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setFinalGameScore(newScore);
        setShowGameOver(true);
      }
      return;
    }

    // Handle last question
    if (currentQuestionIndex === scenario.steps.length - 1) {
      const completionPercentage = (newScore / scenario.steps.length) * 100;
      
      if (completionPercentage === 100) {
        storedScores[scenario.title] = completionPercentage;
        localStorage.setItem('scores', JSON.stringify(storedScores));
      }
      
      setFinalGameScore(newScore);
      setShowGameOver(true);
      return;
    }

    // Move to next question
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handleTimeUp = () => {
    setIsTimeUp(true);
    setFinalGameScore(score);
    setShowGameOver(true);
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowGameOver(false);
    setIsTimeUp(false);
    setResetTimer(prev => !prev); // Toggle to force timer reset
  };

  return (
    <div style={{ minHeight: '100vh', padding: '2rem', position: 'relative', zIndex: 1 }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: '15px',
        padding: '2rem',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div className="score" style={{ 
            color: '#fff', 
            fontSize: '1.2rem',
            justifySelf: 'start'
          }}>
            Score: {score}
          </div>
          <div style={{
            fontFamily: 'Kanit, sans-serif',
            color: '#fff',
            fontSize: '1.2rem',
            textAlign: 'center',
            padding: '0.5rem 1rem',
            background: 'rgba(0, 0, 0, 0.7)',
            borderRadius: '8px',
            maxWidth: '600px',
            width: '100%'
          }}>
            {currentQuestion.question}
          </div>
          <div className="timer" style={{ 
            color: '#fff', 
            fontSize: '1.2rem',
            justifySelf: 'end'
          }}>
            <Timer 
              key={resetTimer} // Add this key to force remount
              duration={60} 
              onTimeUp={handleTimeUp} 
            />
          </div>
        </div>

        <div className="question-section">
          <div className="image-container">
            <img
              src={currentQuestion.image}
              alt="Question Illustration"
              style={{
                width: '100%',
                borderRadius: '15px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.)'
              }}
            />
            <div className="options-overlay" style={{
              background: 'rgba(0, 0, 0, 0.4)',
              padding: '0rem',
              borderRadius: '8px',
              marginTop: '1rem'
            }}>
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option.isCorrect)}
                  style={{
                    margin: '0.5rem 0',
                    padding: '1rem 2rem',
                    fontSize: '1.3rem',
                    border: 'none',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(3px)',
                    WebkitBackdropFilter: 'blur(5px)',
                    width: '80%',
                    textAlign: 'left'
                  }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.02)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        </div>

        {showGameOver && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            borderRadius: '15px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            animation: 'fadeIn 0.3s ease-out'
          }}>
            {isTimeUp && (
              <div style={{
                color: '#ff4444',
                fontSize: '3rem',
                fontWeight: 'bold',
                marginBottom: '2rem',
                textAlign: 'center',
                fontFamily: 'Kanit, sans-serif',
                textShadow: '0 0 20px rgba(255, 68, 68, 0.7)',
                animation: 'pulse 2s infinite'
              }}>
                Time's Up!
              </div>
            )}
            <div style={{
              background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(240, 240, 240, 0.95))',
              padding: '3rem',
              borderRadius: '20px',
              textAlign: 'center',
              maxWidth: '450px',
              width: '90%',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
              animation: 'slideUp 0.5s ease-out',
              border: '2px solid rgba(255, 255, 255, 0.1)'
            }}>
              <img 
                src="/game-over-icon.jpeg" 
                alt="Game Over" 
                style={{
                  width: '120px',
                  height: '120px',
                  marginBottom: '1.5rem',
                  filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))',
                  animation: 'bounce 1s ease-in-out'
                }}
              />
              <h2 style={{ 
                fontSize: '2.5rem', 
                color: '#2c3e50',
                marginBottom: '1.5rem',
                fontFamily: 'Kanit, sans-serif',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)'
              }}>
                Game Over!
              </h2>
              <p style={{ 
                fontSize: '1.4rem', 
                color: '#34495e',
                marginBottom: '2.5rem',
                fontWeight: '500'
              }}>
                Your final score is: <span style={{ color: '#e74c3c', fontSize: '1.6rem' }}>{finalGameScore}</span>
              </p>
              <div style={{
                display: 'flex',
                gap: '1.5rem',
                justifyContent: 'center'
              }}>
                <button
                  onClick={() => navigate('/')}
                  style={{
                    padding: '1rem 2rem',
                    background: 'linear-gradient(145deg, #4CAF50, #45a049)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease',
                    flex: 1,
                    maxWidth: '160px',
                    boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
                  }}
                  onMouseEnter={e => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(76, 175, 80, 0.4)';
                  }}
                  onMouseLeave={e => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.3)';
                  }}
                >
                  Home
                </button>
                <button
                  onClick={handleRetry}
                  style={{
                    padding: '1rem 2rem',
                    background: 'linear-gradient(145deg, #2196F3, #1e88e5)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease',
                    flex: 1,
                    maxWidth: '160px',
                    boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)'
                  }}
                  onMouseEnter={e => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(33, 150, 243, 0.4)';
                  }}
                  onMouseLeave={e => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(33, 150, 243, 0.3)';
                  }}
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GamePage;

<style>
{`
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @keyframes bounce {
    0% { transform: scale(0.3); opacity: 0; }
    50% { transform: scale(1.1); }
    70% { transform: scale(0.9); }
    100% { transform: scale(1); opacity: 1; }
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
`}
</style>