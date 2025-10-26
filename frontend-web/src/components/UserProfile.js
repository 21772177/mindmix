import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserStats from './UserStats';
import Leaderboard from './Leaderboard';
import ChallengeHistory from './ChallengeHistory';
import Achievements from './Achievements';
import Settings from './Settings';
import Friends from './Friends';
import './UserProfile.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

function UserProfile({ user, token, onLogout, onBack }) {
  const [activeTab, setActiveTab] = useState('stats');
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.id) {
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/analytics/stats/${user.id}`);
      if (response.data.ok) {
        setUserStats(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-profile-container">
      <div className="profile-header">
        <button className="btn btn-secondary" onClick={onBack}>
          ← Back
        </button>
        <div className="profile-info">
          <div className="profile-avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <div>
            <h1>{user?.name}</h1>
            <p>{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="profile-tabs">
        <button 
          className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          📊 My Stats
        </button>
        <button 
          className={`tab ${activeTab === 'friends' ? 'active' : ''}`}
          onClick={() => setActiveTab('friends')}
        >
          👥 Friends
        </button>
        <button 
          className={`tab ${activeTab === 'leaderboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('leaderboard')}
        >
          🏆 Leaderboard
        </button>
        <button 
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          📜 History
        </button>
        <button 
          className={`tab ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          🏆 Achievements
        </button>
        <button 
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Settings
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'stats' && <UserStats user={user} stats={userStats} />}
      
      {activeTab === 'friends' && <Friends token={token} />}
      
      {activeTab === 'leaderboard' && (
        <>
          <div className="card">
            <div className="form-group">
              <label>Leaderboard Type</label>
              <select className="select-input" onChange={(e) => {
                // Leaderboard component will handle this
              }}>
                <option value="global">🌍 Global</option>
                <option value="music">🎵 Music</option>
                <option value="logic">🧩 Logic</option>
                <option value="trivia">📚 Trivia</option>
                <option value="creative">🎨 Creative</option>
                <option value="math">🔢 Math</option>
              </select>
            </div>
          </div>
          <Leaderboard type="global" />
        </>
      )}

      {activeTab === 'history' && <ChallengeHistory token={token} />}

      {activeTab === 'achievements' && <Achievements user={user} stats={userStats} />}

      {activeTab === 'settings' && <Settings user={user} onLogout={onLogout} />}
    </div>
  );
}

export default UserProfile;
