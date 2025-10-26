import React, { useState } from 'react';
import axios from 'axios';
import Recommendations from './Recommendations';
import './Dashboard.css';

import API_URL from '../config/api';

function Dashboard({ user, token, onLogout, onStartChallenge, onStartGroupMode, onStartBattle, onStartKnowledge, onOpenProfile, onStartBeatRush }) {
  const [difficulty, setDifficulty] = useState('easy');
  const [type, setType] = useState('logic'); // Changed default to logic
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState(false);

  const handleGenerateChallenge = async () => {
    setError('');
    setGenerating(true);

    try {
      const response = await axios.get(`${API_URL}/ai/generate`, {
        params: { type, difficulty, userId: user?.id }
      });
      
      if (response.data.ok) {
        onStartChallenge(response.data.data);
      } else {
        setError(response.data.error || 'Failed to generate challenge');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate challenge');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user?.name}</h1>
          <p>Ready for a challenge?</p>
        </div>
        <div className="header-actions">
          {onStartBeatRush && (
            <button className="btn btn-music" onClick={onStartBeatRush} style={{marginRight: '0.5rem', background: '#6366f1', border: 'none'}}>
              🎵 BeatRush
            </button>
          )}
          {onOpenProfile && (
            <button className="btn btn-profile" onClick={onOpenProfile} style={{marginRight: '0.5rem'}}>
              👤 Profile
            </button>
          )}
          {onStartKnowledge && (
            <button className="btn btn-info" onClick={onStartKnowledge} style={{marginRight: '0.5rem'}}>
              📚 Study Zone
            </button>
          )}
          {onStartBattle && (
            <button className="btn btn-danger" onClick={onStartBattle} style={{marginRight: '0.5rem'}}>
              ⚔️ Live Battle
            </button>
          )}
          {onStartGroupMode && (
            <button className="btn btn-primary" onClick={onStartGroupMode} style={{marginRight: '0.5rem'}}>
              👥 Group Play
            </button>
          )}
        </div>
      </div>

      {/* Recommendations */}
      <Recommendations user={user} token={token} />

      {/* Challenge Generation */}
      <div className="card">
            <h2>Generate Challenge</h2>
            
                    <div className="form-group">
                      <label>Challenge Type</label>
                      <select value={type} onChange={(e) => setType(e.target.value)} className="select-input">
                        <option value="logic">🧩 Logic</option>
                        <option value="trivia">📚 Trivia</option>
                        <option value="creative">🎨 Creative</option>
                      </select>
                    </div>

            <div className="form-group">
              <label>Difficulty</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="select-input">
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {error && <div className="error">{error}</div>}
            
            <button 
              className="btn btn-primary"
              onClick={handleGenerateChallenge}
              disabled={generating}
            >
              {generating ? 'Generating...' : 'Generate Challenge'}
            </button>
          </div>
    </div>
  );
}

export default Dashboard;
