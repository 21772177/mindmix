import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config/api';
import './KnowledgeZone.css';

function KnowledgeZone({ user, token, onBack }) {
  const userId = user?.id;
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [wrongAttempts, setWrongAttempts] = useState({}); // Track wrong attempts per question

  useEffect(() => {
    fetchTopics();
  }, []);

  useEffect(() => {
    if (selectedTopic) {
      fetchQuizzes(selectedTopic);
    }
  }, [selectedTopic]);

  const fetchTopics = async () => {
    try {
      const response = await axios.get(`${API_URL}/knowledge/topics`);
      if (response.data.ok) {
        setTopics(response.data.data.topics);
      }
    } catch (err) {
      console.error('Failed to fetch topics:', err);
    }
  };

  const fetchQuizzes = async (topic) => {
    setLoading(true);
    setError('');
    try {
      // Optimize: Add cache to avoid reloading same topic
      const cacheKey = `quiz_${topic}`;
      const cached = sessionStorage.getItem(cacheKey);
      
      if (cached) {
        const data = JSON.parse(cached);
        setQuizzes(data.quizzes);
        setCurrentQuiz(0);
        setScore(0);
        setAnswers({});
        setLoading(false);
        return;
      }
      
      const response = await axios.get(`${API_URL}/knowledge/quiz/${topic}`, {
        params: { userId: user?.id },
        timeout: 15000 // 15 second timeout for better reliability
      });
      if (response.data.ok) {
        setQuizzes(response.data.data.quizzes);
        // Cache the response
        sessionStorage.setItem(cacheKey, JSON.stringify(response.data.data));
        setCurrentQuiz(0);
        setScore(0);
        setAnswers({});
      }
    } catch (err) {
      console.error('Quiz fetch error:', err);
      if (err.message === 'Network Error' || err.code === 'ECONNABORTED') {
        setError('Network error. Please check your connection and try again.');
      } else if (err.response?.status === 404) {
        setError('No quizzes available for this topic yet.');
      } else {
        setError('Failed to load quizzes. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (quizIndex, selectedOption) => {
    setAnswers({ ...answers, [quizIndex]: selectedOption });
    
    // Check if answer is correct
    const quiz = quizzes[quizIndex];
    const isCorrect = selectedOption === quiz.answer || selectedOption === quiz.correctAnswer;
    
    // Track wrong attempts
    if (!isCorrect) {
      setWrongAttempts(prev => ({ ...prev, [quizIndex]: (prev[quizIndex] || 0) + 1 }));
    }
    
    const currentWrongAttempts = wrongAttempts[quizIndex] || 0;
    
    // Update stats in database
    if (token && user) {
      try {
        await axios.post(
          `${API_URL}/stats/update`,
          { type: 'knowledge', correct: isCorrect },
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
      } catch (err) {
        console.error('Failed to update stats:', err);
      }
    }
    
    // Show result immediately
    setShowResults(true);
    
    // If correct, add points and mark as answered
    if (isCorrect) {
      setScore(score + (quiz.points || 10));
      
      // Mark question as answered for no-repeat system - CRITICAL FOR PERSISTENCE
      if (token && quiz.question && user) {
        try {
          const response = await axios.post(
            `${API_URL}/ai/mark-answered`,
            {
              questionText: quiz.question,
              challengeType: 'knowledge'
            },
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
          console.log('✅ Knowledge Zone question marked and SAVED:', response.data);
        } catch (err) {
          console.error('❌ Failed to mark question:', err);
        }
      }
      
      // Auto-advance to next question after 2 seconds
      setTimeout(() => {
        if (quizIndex < quizzes.length - 1) {
          setCurrentQuiz(quizIndex + 1);
          setShowResults(false);
          setWrongAttempts(prev => ({ ...prev, [quizIndex]: 0 }));
        } else {
          // Last question - show final results
          handleSubmit();
        }
      }, 2000);
    } else {
      // Wrong answer - show message and allow retry
      if (currentWrongAttempts >= 2) {
        // After 2 wrong attempts, show correct answer and wait for manual next
        setTimeout(() => {
          // Don't auto-advance, wait for user to click next
        }, 2000);
      } else {
        // After 1 wrong attempt, show message and allow retry
        setTimeout(() => {
          setShowResults(false);
          setAnswers({ ...answers, [quizIndex]: undefined });
        }, 2000);
      }
    }
  };

  const handleSubmit = () => {
    let totalScore = 0;
    quizzes.forEach((quiz, index) => {
      if (answers[index] === quiz.correctAnswer || quiz.answer === answers[index]) {
        totalScore += quiz.points || 10;
      }
    });
    setScore(totalScore);
    setShowResults(true);
  };

  const resetQuiz = () => {
    setCurrentQuiz(0);
    setScore(0);
    setAnswers({});
    setShowResults(false);
  };

  const handleNextQuiz = () => {
    if (currentQuiz < quizzes.length - 1) {
      setCurrentQuiz(currentQuiz + 1);
    } else {
      handleSubmit(); // Submit if last question
    }
  };

  if (selectedTopic && quizzes.length > 0) {
    const quiz = quizzes[currentQuiz];
    const userAnswer = answers[currentQuiz];

    return (
      <div className="knowledge-zone-container">
        <div className="quiz-header">
          <button className="btn btn-secondary" onClick={() => {
            setSelectedTopic(null);
            resetQuiz();
          }}>
            ← Back to Topics
          </button>
          <h1>📚 Knowledge Zone</h1>
          <div className="quiz-progress">
            Question {currentQuiz + 1} / {quizzes.length}
          </div>
        </div>

        {!showResults ? (
          <>
            <div className="card quiz-card">
              <div className="quiz-topic-badge">
                {topics.find(t => t.id === selectedTopic)?.name || selectedTopic}
              </div>
              
              <h2>{quiz.question || quiz.quiz}</h2>
              
              <div className="options-grid">
                {(quiz.options || []).map((option, index) => {
                  let className = 'option-btn';
                  const isCorrect = quiz.answer === index;
                  const isSelected = userAnswer === index;

                  if (showResults) {
                    if (isCorrect) className += ' correct';
                    if (isSelected && !isCorrect) className += ' incorrect';
                  } else if (isSelected) {
                    className += ' selected';
                  }

                  return (
                    <button
                      key={index}
                      className={className}
                      onClick={() => !showResults && handleAnswer(currentQuiz, index)}
                      disabled={showResults}
                    >
                      <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                      <span className="option-text">{option}</span>
                    </button>
                  );
                })}
              </div>

              {showResults && (() => {
                const isCorrect = userAnswer === quiz.answer || userAnswer === quiz.correctAnswer;
                const wrongAttempts = wrongAttempts[currentQuiz] || 0;
                
                return (
                  <div className="quiz-feedback">
                    {isCorrect ? (
                      <div className="success-message">
                        <h3>🎉 Correct!</h3>
                        <p>Great job! Moving to next question...</p>
                      </div>
                    ) : wrongAttempts >= 2 ? (
                      <div className="failure-message">
                        <h3>❌ Wrong Answer</h3>
                        <p>The correct answer is: <strong>{quiz.options[quiz.answer || quiz.correctAnswer]}</strong></p>
                        {currentQuiz < quizzes.length - 1 && (
                          <button
                            className="btn btn-primary"
                            onClick={() => {
                              setCurrentQuiz(currentQuiz + 1);
                              setShowResults(false);
                              setAnswers({ ...answers, [currentQuiz]: undefined });
                            }}
                          >
                            Next Question →
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="try-again-message">
                        <h3>❌ Wrong Answer</h3>
                        <p>Try again!</p>
                      </div>
                    )}
                  </div>
                );
              })()}

              {showResults && currentQuiz === quizzes.length - 1 && (
                <div className="quiz-continue">
                  <button
                    className="btn btn-success"
                    onClick={handleSubmit}
                  >
                    View Final Results
                  </button>
                </div>
              )}

              {!showResults && (
                <div className="quiz-navigation">
                  <span className="quiz-counter">
                    Question {currentQuiz + 1} / {quizzes.length}
                  </span>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="card results-card">
            <h2>🎉 Quiz Complete!</h2>
            <div className="results-score">
              <div className="score-circle">
                <span className="score-number">{score}</span>
                <span className="score-label">Points</span>
              </div>
              <p className="results-message">
                You scored {score} out of {quizzes.reduce((sum, q) => sum + (q.points || 10), 0)} possible points!
              </p>
            </div>
            
            <button className="btn btn-primary" onClick={resetQuiz}>
              Try Again
            </button>
            <button className="btn btn-secondary" onClick={() => {
              setSelectedTopic(null);
              resetQuiz();
            }}>
              Back to Topics
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="knowledge-zone-container">
      <div className="knowledge-header">
        <button className="btn btn-secondary" onClick={onBack}>
          ← Back
        </button>
        <h1>📚 Study Zone</h1>
      </div>

      {loading && <div className="loading">Loading quizzes...</div>}
      
      {error && <div className="error">{error}</div>}

      <div className="topics-grid">
        {topics.map((topic) => (
          <div
            key={topic.id}
            className="topic-card"
            onClick={() => setSelectedTopic(topic.id)}
          >
            <div className="topic-icon">{topic.name.split(' ')[0]}</div>
            <h3>{topic.name.replace(/📚|🔬|🌍|📖|🔢|✨/, '').trim()}</h3>
            <p>{topic.description}</p>
            <button className="btn btn-primary">Start Learning</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default KnowledgeZone;
