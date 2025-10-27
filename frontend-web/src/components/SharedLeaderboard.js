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
      const response = await axios.get(`${API_URL}/analytics/leaderboard?type=global&limit=10`);
      
      if (response.data.ok && response.data.data.leaderboard) {
        setLeaderboard(response.data.data.leaderboard);
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

  const getMedal = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `${rank}.`;
  };

  return (
    <div className="shared-leaderboard card">
      <h3>🏆 Leaderboard (Play Mode)</h3>
      
      {leaderboard.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
          No entries yet. Be the first to apply!
        </p>
      ) : (
        <div style={{ padding: '1rem' }}>
          {leaderboard.slice(0, 10).map((player) => (
            <div key={player.rank} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem',
              marginBottom: '0.5rem',
              backgroundColor: player.rank <= 3 ? 'rgba(255, 215, 0, 0.1)' : 'transparent',
              borderRadius: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.2rem', minWidth: '2rem' }}>{getMedal(player.rank)}</span>
                <span style={{ fontWeight: player.rank <= 3 ? 'bold' : 'normal' }}>
                  {player.name}
                </span>
              </div>
              <div style={{ fontWeight: 'bold', color: '#007BFF' }}>
                {player.score || player.totalXP || 0} pts
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SharedLeaderboard;

