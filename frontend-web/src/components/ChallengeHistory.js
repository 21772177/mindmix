import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ChallengeHistory.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

function ChallengeHistory({ token }) {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchHistory();
  }, [filterType, token]);

  const fetchHistory = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const params = filterType !== 'all' ? { type: filterType } : {};
      const response = await axios.get(`${API_URL}/scores/history`, {
        params,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.ok) {
        setHistory(response.data.data.scores || []);
        setStats(response.data.data.stats || {});
      }
    } catch (err) {
      setError('Failed to load history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getTypeEmoji = (type) => {
    const emojis = {
      music: '🎵',
      logic: '🧩',
      trivia: '📚',
      creative: '🎨',
      math: '🔢'
    };
    return emojis[type] || '🎯';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!token) {
    return (
      <div className="history-empty">
        <p>Login to see your challenge history</p>
      </div>
    );
  }

  if (loading) {
    return <div className="history-loading">Loading your history...</div>;
  }

  if (error) {
    return <div className="history-error">{error}</div>;
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <h2>📜 Your Challenge History</h2>
        
        {/* Stats Summary */}
        {stats && (
          <div className="history-stats">
            <div className="stat-box">
              <div className="stat-value">{stats.total || 0}</div>
              <div className="stat-label">Total Challenges</div>
            </div>
            <div className="stat-box success">
              <div className="stat-value">{stats.correct || 0}</div>
              <div className="stat-label">Correct</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{stats.bestStreak || 0}</div>
              <div className="stat-label">Best Streak 🔥</div>
            </div>
          </div>
        )}
      </div>

      {/* Filter */}
      <div className="history-filter">
        <label>Filter by Type:</label>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="select-input">
          <option value="all">All Types</option>
          <option value="music">🎵 Music</option>
          <option value="logic">🧩 Logic</option>
          <option value="trivia">📚 Trivia</option>
          <option value="creative">🎨 Creative</option>
          <option value="math">🔢 Math</option>
        </select>
      </div>

      {/* History List */}
      {history.length === 0 ? (
        <div className="history-empty-message">
          <p>No challenge history yet.</p>
          <p>Start playing to see your past challenges here!</p>
        </div>
      ) : (
        <div className="history-list">
          {history.map((item, index) => (
            <div 
              key={index} 
              className={`history-item ${item.isCorrect ? 'correct' : 'incorrect'}`}
            >
              <div className="history-type">{getTypeEmoji(item.challengeType)}</div>
              <div className="history-content">
                <div className="history-info">
                  <span className="challenge-type">{item.challengeType}</span>
                  <span className="challenge-difficulty">{item.difficulty}</span>
                  <span className="challenge-date">{formatDate(item.completedAt)}</span>
                </div>
                <div className="history-result">
                  {item.isCorrect ? (
                    <span className="result-success">✓ Correct</span>
                  ) : (
                    <span className="result-failure">✗ Wrong</span>
                  )}
                </div>
              </div>
              <div className="history-rewards">
                {item.xp > 0 && <span className="reward">⚡ {item.xp}</span>}
                {item.coins > 0 && <span className="reward">💰 {item.coins}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ChallengeHistory;
