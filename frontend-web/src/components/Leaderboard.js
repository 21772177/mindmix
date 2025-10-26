import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Leaderboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

function Leaderboard({ type = 'global' }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLeaderboard();
  }, [type]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/analytics/leaderboard`, {
        params: { type, limit: 50 }
      });
      
      if (response.data.ok) {
        setLeaderboard(response.data.data.leaderboard);
      }
    } catch (err) {
      setError('Failed to load leaderboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getMedal = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  const getCategoryEmoji = (type) => {
    const emojis = {
      global: '🌍',
      music: '🎵',
      logic: '🧩',
      trivia: '📚',
      creative: '🎨',
      math: '🔢'
    };
    return emojis[type] || '🎯';
  };

  if (loading) {
    return <div className="leaderboard-loading">Loading leaderboard...</div>;
  }

  if (error) {
    return <div className="leaderboard-error">{error}</div>;
  }

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h2>{getCategoryEmoji(type)} {type.charAt(0).toUpperCase() + type.slice(1)} Leaderboard</h2>
      </div>
      
      {leaderboard.length === 0 ? (
        <div className="leaderboard-empty">
          <p>No players yet. Be the first to top the leaderboard!</p>
        </div>
      ) : (
        <div className="leaderboard-list">
          {leaderboard.map((player) => (
            <div key={player.rank} className={`leaderboard-item ${player.rank <= 3 ? 'top-' + player.rank : ''}`}>
              <div className="rank">{getMedal(player.rank)}</div>
              <div className="player-info">
                <div className="player-name">{player.name}</div>
                <div className="player-stats">
                  <span className="stat">Level {player.level}</span>
                  <span className="stat">{player.totalXP} XP</span>
                  <span className="stat">💰 {player.coins}</span>
                </div>
              </div>
              <div className="player-score">{player.score.toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Leaderboard;
