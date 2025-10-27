import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ChallengeView.css';

import API_URL from '../config/api';

function ChallengeView({ challenge, token, onBack, onNext, isMultiQuiz, quizIndex, quizzes, user, onNextChallenge }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [startTime] = useState(Date.now());
  const [earnedXP, setEarnedXP] = useState(0);
  const [earnedCoins, setEarnedCoins] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [wrongAttemptCount, setWrongAttemptCount] = useState(0); // Track wrong attempts

  // Reset states when challenge changes
  useEffect(() => {
    setWrongAttemptCount(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
  }, [challenge]);

  if (!challenge) {
    return (
      <div className="challenge-container">
        <div className="card">
          <p>No challenge loaded</p>
          <button className="btn btn-primary" onClick={onBack}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  const handleAnswer = async (index) => {
    setSelectedAnswer(index);
    const correct = index === challenge.answer;
    setIsCorrect(correct);
    setShowResult(true);

    // Track wrong attempts
    if (!correct) {
      setWrongAttemptCount(prev => prev + 1);
    }

    // Update stats in database
    if (token && user) {
      try {
        await axios.post(
          `${API_URL}/stats/update`,
          { type: challenge.type || 'general', correct },
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
      } catch (err) {
        console.error('Failed to update stats:', err);
      }
    }

    // Submit score if user is logged in
    if (token) {
      try {
        const timeTaken = Date.now() - startTime;
        
        // Submit to scores endpoint
        const scoreResponse = await axios.post(
          `${API_URL}/scores/submit`,
          {
            challengeId: challenge.id || null,
            challengeType: challenge.type,
            difficulty: challenge.difficulty,
            isCorrect: correct,
            timeTaken: timeTaken
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (scoreResponse.data.ok) {
          setEarnedXP(scoreResponse.data.data.score.xp || 0);
          setEarnedCoins(scoreResponse.data.data.score.coins || 0);
          console.log('Score submitted:', scoreResponse.data.data);
        }

        // Also mark question as answered for no-repeat system
        if (challenge.prompt) {
          try {
            await axios.post(
              `${API_URL}/knowledge/quiz/submit`,
              {
                questionText: challenge.prompt,
                answer: index,
                timeTaken: timeTaken
              },
              {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              }
            );
          } catch (err) {
            // Silent fail for question tracking
            console.log('Question tracking skipped');
          }
        }

        // Auto-advance on correct answer
        if (isCorrect) {
          setTimeout(() => {
            if (onNextChallenge) {
              onNextChallenge(); // Load next challenge automatically
            } else if (onBack) {
              onBack(); // Go back to dashboard if no handler
            }
          }, 2000); // Show result for 2 seconds then advance
        }
      } catch (err) {
        console.error('Failed to submit score:', err);
      }
    }
  };

  const handleRetry = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
  };

  const handleSkip = () => {
    if (isMultiQuiz && onNext) {
      onNext();
    } else {
      onBack();
    }
  };

  const handleNext = () => {
    // If onNextChallenge is provided, load next challenge
    // Otherwise, go back to dashboard
    if (onNextChallenge) {
      onNextChallenge();
    } else {
      onBack();
    }
  };

  return (
    <div className="challenge-container">
      <div className="challenge-card">
        <div className="challenge-header">
          <h2>🎯 Challenge</h2>
          <span className={`badge ${challenge.difficulty}`}>{challenge.difficulty}</span>
        </div>

        <div className="challenge-prompt">
          <p>{challenge.prompt}</p>
        </div>

        <div className="options-grid">
          {challenge.options.map((option, index) => {
            let className = 'option-btn';
            // Only show correct answer if:
            // - User got it right (isCorrect)
            // - OR user tried twice (wrongAttemptCount >= 2)
            // On first wrong attempt (wrongAttemptCount === 1), DON'T show green yet
            const showCorrectAnswer = showResult && (isCorrect || wrongAttemptCount >= 2);
            if (showCorrectAnswer && index === challenge.answer) {
              className += ' correct';
            } else if (showResult && index === selectedAnswer && !isCorrect) {
              className += ' incorrect';
            }

            return (
              <button
                key={index}
                className={className}
                onClick={() => !showResult && handleAnswer(index)}
                disabled={showResult}
              >
                {option}
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className="result-section">
            <div className={`result-box ${isCorrect ? 'success' : 'failure'}`}>
              <h3>{isCorrect ? '🎉 Correct!' : '❌ Wrong Answer'}</h3>
              <p>
                {isCorrect 
                  ? 'Great job! You got it right.' 
                  : wrongAttemptCount === 1
                    ? 'Incorrect answer. Try again!'
                    : wrongAttemptCount >= 2
                      ? `The correct answer was: ${challenge.options[challenge.answer]}`
                      : 'Incorrect answer. Try again!'
                }
              </p>
              {token && isCorrect && (earnedXP > 0 || earnedCoins > 0) && (
                <div className="rewards">
                  {earnedXP > 0 && <span className="reward">⚡ +{earnedXP} XP</span>}
                  {earnedCoins > 0 && <span className="reward">💰 +{earnedCoins} Coins</span>}
                </div>
              )}
            </div>
            <div className="result-actions">
              {isCorrect ? (
                isMultiQuiz ? (
                  <div className="auto-advance-message">
                    <p>Auto-advancing to next question...</p>
                  </div>
                ) : (
                  <button className="btn btn-primary" onClick={handleNext}>
                    Next Challenge
                  </button>
                )
              ) : (
                <div className="retry-actions">
                  {wrongAttemptCount < 2 && (
                    <button className="btn btn-secondary" onClick={handleRetry}>
                      🔄 Try Again
                    </button>
                  )}
                  <button className="btn btn-primary" onClick={handleSkip}>
                    {wrongAttemptCount < 2 ? 'Skip Question →' : 'Next Question →'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChallengeView;
