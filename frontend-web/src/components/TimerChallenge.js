import React, { useState, useEffect } from 'react';
import './TimerChallenge.css';

// Timer durations based on difficulty
const TIMER_DURATIONS = {
  easy: 45,    // 45 seconds
  medium: 30,  // 30 seconds
  hard: 15     // 15 seconds
};

function TimerChallenge({ challenge, onAnswer, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATIONS[challenge?.difficulty || 'medium']);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showTimer, setShowTimer] = useState(true);

  useEffect(() => {
    if (!challenge) return;

    // Reset timer when challenge changes
    setTimeLeft(TIMER_DURATIONS[challenge.difficulty || 'medium']);
    setSelectedAnswer(null);

    // Start countdown
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [challenge]);

  const handleTimeUp = () => {
    if (onTimeUp) {
      onTimeUp(timeLeft);
    }
  };

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
    if (onAnswer) {
      onAnswer(index);
    }
  };

  // Audio playback for question
  const speakQuestion = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(challenge.prompt);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Audio playback for options
  const speakOption = (option) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(option);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!challenge) return null;

  const timerColor = timeLeft <= 10 ? 'red' : timeLeft <= 20 ? 'orange' : 'green';

  return (
    <div className="timer-challenge-container">
      {/* Timer Display */}
      {showTimer && (
        <div className={`timer-display ${timerColor}`}>
          <div className="timer-label">Time Left</div>
          <div className="timer-value">{timeLeft}s</div>
        </div>
      )}

      <div className="challenge-card">
        <div className="challenge-header">
          <h2>🎯 Challenge</h2>
          <span className={`badge ${challenge.difficulty}`}>{challenge.difficulty}</span>
        </div>

        <div className="challenge-prompt">
          <p>{challenge.prompt}</p>
          <button className="btn btn-audio" onClick={speakQuestion} title="Read question aloud">
            🔊 Read Question
          </button>
        </div>

        <div className="options-grid">
          {challenge.options.map((option, index) => (
            <div key={index} className="option-wrapper">
              <button
                className={`option-btn ${selectedAnswer === index ? 'selected' : ''}`}
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
              >
                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                <span className="option-text">{option}</span>
              </button>
              <button 
                className="btn-audio-small" 
                onClick={() => speakOption(option)}
                title="Read option aloud"
              >
                🔊
              </button>
            </div>
          ))}
        </div>

        <div className="timer-controls">
          <button 
            className="btn btn-secondary" 
            onClick={() => setShowTimer(!showTimer)}
          >
            {showTimer ? 'Hide Timer' : 'Show Timer'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TimerChallenge;
