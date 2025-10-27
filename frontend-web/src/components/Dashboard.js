import React, { useState } from 'react';
import axios from 'axios';
import Recommendations from './Recommendations';
import './Dashboard.css';

import API_URL from '../config/api';

function Dashboard({ user, token, onLogout, onStartChallenge, onStartGroupMode, onStartBattle, onStartKnowledge, onOpenProfile, onStartBeatRush, activeMode }) {
  const [difficulty, setDifficulty] = useState('easy');
  const [type, setType] = useState('logic');
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
      {/* Welcome Section */}
      <div style={{ 
        marginBottom: '2rem',
        padding: '1.5rem',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        borderRadius: '12px'
      }}>
        <h2 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Welcome, {user?.name}</h2>
        <p style={{ margin: 0, color: '#666' }}>Ready for a challenge?</p>
      </div>

      {/* IMPORTANT: Only show game buttons when Play Mode tab is active */}
      {activeMode === 'play' && (
        <>
          {/* Game Mode Selection Buttons - Only visible in Play Mode */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <button 
              onClick={onStartBeatRush} 
              style={{
                padding: '2rem',
                background: 'linear-gradient(135deg, #007BFF 0%, #8A2BE2 100%)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-4px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              🎵 BeatRush
            </button>
            
            <button 
              onClick={onStartGroupMode} 
              style={{
                padding: '2rem',
                background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-4px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              👥 Group Play
            </button>
            
            <button 
              onClick={onStartBattle} 
              style={{
                padding: '2rem',
                background: 'linear-gradient(135deg, #dc3545 0%, #fd7e14 100%)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-4px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              ⚔️ Live Battle
            </button>
          </div>

          {/* Recommendations - Only visible in Play Mode */}
          <Recommendations user={user} token={token} />

          {/* Generate Challenge - Only visible in Play Mode */}
          <div className="card" style={{ marginTop: '2rem' }}>
            <h2 style={{ marginTop: 0 }}>Generate Challenge</h2>
            
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
        </>
      )}
    </div>
  );
}

export default Dashboard;
