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
      <h3>🏆 Leaderboard (Play Mode)</h3>
      
      <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
        No entries yet. Be the first to apply!
      </p>
    </div>
  );
}

export default SharedLeaderboard;

