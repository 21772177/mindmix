import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config/api';
import './SharedLeaderboard.css';

function SharedLeaderboard({ user, token, activeMode }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [activeMode]);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/leaderboard?mode=${activeMode}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.ok) {
        setLeaderboard(response.data.data.leaderboard);
        setMyRank(response.data.data.myRank);
      }
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="shared-leaderboard card"><p>Loading leaderboard...</p></div>;
  }

  return (
    <div className="shared-leaderboard card">
      <h3>🏆 Leaderboard ({activeMode === 'play' ? 'Play Mode' : 'Learn Mode'})</h3>
      
      {myRank && (
        <div className="my-rank">
          <div className="rank-badge">
            <span className="rank-number">#{myRank.rank}</span>
            <span className="rank-label">Your Rank</span>
          </div>
          <div className="rank-stats">
            <span>Score: {myRank.totalPoints}</span>
            <span>Streak: {myRank.streak} 🔥</span>
          </div>
        </div>
      )}

      <div className="leaderboard-list">
        {leaderboard.slice(0, 10).map((entry, index) => (
          <div key={entry._id || index} className={`leaderboard-item ${entry._id === user?.id ? 'my-entry' : ''}`}>
            <div className="rank-number-badge">
              {index + 1 <= 3 && <span className="medal">🥇🥈🥉</span>}
              <span className="rank-text">#{index + 1}</span>
            </div>
            <div className="user-info">
              <span className="user-name">{entry.name}</span>
              <span className="user-points">{entry.totalPoints} pts</span>
            </div>
          </div>
        ))}
      </div>

      {leaderboard.length === 0 && (
        <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
          No entries yet. Be the first to play!
        </p>
      )}
    </div>
  );
}

export default SharedLeaderboard;

