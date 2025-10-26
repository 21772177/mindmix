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
        timeout: 3000 // 3 second timeout for fast response
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
      setError('Failed to load quizzes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (quizIndex, selectedOption) => {
    setAnswers({ ...answers, [quizIndex]: selectedOption });
    
    // Check if answer is correct
    const quiz = quizzes[quizIndex];
    const isCorrect = selectedOption === quiz.answer || selectedOption === quiz.correctAnswer;
    
    // Show result immediately
    setShowResults(true);
    
    // If correct, add points and mark as answered
    if (isCorrect) {
      setScore(score + (quiz.points || 10));
      
      // Auto-advance to next question after 2 seconds
      setTimeout(() => {
        if (quizIndex < quizzes.length - 1) {
          setCurrentQuiz(quizIndex + 1);
          setShowResults(false);
        } else {
          // Last question - show final results
          handleSubmit();
        }
      }, 2000);
    }
    
    // Mark question as answered for no-repeat system
    if (token && quiz.question) {
      try {
        await axios.post(
          `${API_URL}/knowledge/quiz/submit`,
          {
            questionText: quiz.question,
            answer: selectedOption,
            timeTaken: 0
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
      } catch (err) {
        // Silent fail
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

              {showResults && currentQuiz < quizzes.length - 1 && (
                <div className="quiz-continue">
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setCurrentQuiz(currentQuiz + 1);
                      setShowResults(false);
                    }}
                  >
                    Continue to Next Question
                  </button>
                </div>
              )}

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
        <p className="subtitle">Prepare for competitive exams!</p>
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
