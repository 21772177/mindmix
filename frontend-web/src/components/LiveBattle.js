import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LiveBattle.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

function LiveBattle({ user, token, onBack }) {
  const [mode, setMode] = useState('select'); // select, create, join, waiting, battle, results
  const [battleCode, setBattleCode] = useState('');
  const [battleName, setBattleName] = useState('');
  const [challengeType, setChallengeType] = useState('mixed');
  const [difficulty, setDifficulty] = useState('easy');
  const [challengeCount, setChallengeCount] = useState(5);
  const [battle, setBattle] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState('create');

  const fetchLeaderboard = async () => {
    if (!battle) return;
    
    try {
      const response = await axios.get(`${API_URL}/battles/${battle.code}/leaderboard`);
      if (response.data.ok) {
        setLeaderboard(response.data.data.leaderboard);
      }
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
    }
  };

  useEffect(() => {
    let interval;
    if (battle && (battle.status === 'active' || battle.status === 'starting')) {
      interval = setInterval(() => {
        fetchLeaderboard();
      }, 2000); // Update every 2 seconds
    }
    return () => clearInterval(interval);
  }, [battle]);

  const handleCreateBattle = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/battles/create`,
        {
          name: battleName || `${user.name}'s Battle`,
          challengeType,
          difficulty,
          challengeCount: parseInt(challengeCount),
          timeLimit: 60
        },
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.data.ok) {
        setBattle(response.data.data.battle);
        setMode('waiting');
        setBattleCode(response.data.data.battle.code);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create battle');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinBattle = async () => {
    if (!battleCode || battleCode.length < 4) {
      setError('Please enter a valid battle code');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/battles/join`,
        { code: battleCode },
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.data.ok) {
        setBattle(response.data.data.battle);
        setMode('waiting');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to join battle');
    } finally {
      setLoading(false);
    }
  };

  const handleStartBattle = async () => {
    if (!battle) return;

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/battles/${battle.code}/start`,
        {},
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.data.ok) {
        setMode('battle');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to start battle');
    } finally {
      setLoading(false);
    }
  };

  const getRankEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  return (
    <div className="live-battle-container">
      <div className="battle-header">
        <button className="btn btn-secondary" onClick={onBack}>
          ← Back
        </button>
        <h1>⚔️ Live Battle</h1>
      </div>

      {/* Create/Join Selection */}
      {mode === 'select' && (
        <>
          <div className="selection-tabs">
            <button 
              className={`tab ${selectedMode === 'create' ? 'active' : ''}`}
              onClick={() => setSelectedMode('create')}
            >
              Create Battle
            </button>
            <button 
              className={`tab ${selectedMode === 'join' ? 'active' : ''}`}
              onClick={() => setSelectedMode('join')}
            >
              Join Battle
            </button>
          </div>

          {selectedMode === 'create' && (
            <div className="card">
              <h2>⚔️ Create Live Battle</h2>
              
              <div className="form-group">
                <label>Battle Name</label>
                <input
                  type="text"
                  value={battleName}
                  onChange={(e) => setBattleName(e.target.value)}
                  placeholder={`${user.name}'s Battle`}
                />
              </div>

              <div className="form-group">
                <label>Challenge Type</label>
                <select value={challengeType} onChange={(e) => setChallengeType(e.target.value)}>
                  <option value="mixed">🎯 Mixed</option>
                  <option value="music">🎵 Music</option>
                  <option value="logic">🧩 Logic</option>
                  <option value="trivia">📚 Trivia</option>
                  <option value="creative">🎨 Creative</option>
                  <option value="math">🔢 Math</option>
                </select>
              </div>

              <div className="form-group">
                <label>Difficulty</label>
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="form-group">
                <label>Number of Challenges</label>
                <select value={challengeCount} onChange={(e) => setChallengeCount(e.target.value)}>
                  <option value="3">3 Challenges</option>
                  <option value="5">5 Challenges</option>
                  <option value="10">10 Challenges</option>
                </select>
              </div>

              {error && <div className="error">{error}</div>}
              
              <button 
                className="btn btn-primary"
                onClick={handleCreateBattle}
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Battle'}
              </button>
            </div>
          )}

          {selectedMode === 'join' && (
            <div className="card">
              <h2>Join Battle</h2>
              <p>Enter the battle code to join a live competition</p>
              
              <div className="form-group">
                <label>Battle Code</label>
                <input
                  type="text"
                  value={battleCode}
                  onChange={(e) => setBattleCode(e.target.value.toUpperCase())}
                  placeholder="ABC123"
                  maxLength="6"
                  style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem' }}
                />
              </div>

              {error && <div className="error">{error}</div>}
              
              <button 
                className="btn btn-primary"
                onClick={handleJoinBattle}
                disabled={loading}
              >
                {loading ? 'Joining...' : 'Join Battle'}
              </button>
            </div>
          )}
        </>
      )}

      {/* Waiting Room */}
      {mode === 'waiting' && battle && (
        <div className="waiting-room">
          <div className="card">
            <h2>⚔️ Battle Waiting Room</h2>
            <div className="battle-code-display">
              <label>Battle Code:</label>
              <div className="code-box">{battle.code}</div>
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  navigator.clipboard.writeText(battle.code);
                  alert('Code copied!');
                }}
              >
                Copy Code
              </button>
            </div>

            <div className="battle-info">
              <div className="info-item">
                <span className="info-label">Type:</span>
                <span className="info-value">{battle.challengeType}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Difficulty:</span>
                <span className="info-value">{battle.difficulty}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Challenges:</span>
                <span className="info-value">{battle.challengeCount}</span>
              </div>
            </div>

            <div className="participants-list">
              <h3>Participants ({battle.participants?.length || 0})</h3>
              {battle.participants?.map((p, index) => (
                <div key={index} className="participant-item">
                  {p.userId?.name || 'Loading...'}
                  {p.userId?._id?.toString() === battle.host?._id?.toString() && 
                    <span className="host-badge">⚔️ Host</span>}
                </div>
              ))}
            </div>

            {battle.host?._id?.toString() === user.id && (
              <button 
                className="btn btn-primary btn-large"
                onClick={handleStartBattle}
                disabled={loading || !battle.participants || battle.participants.length < 2}
              >
                {loading ? 'Starting...' : 'Start Battle! ⚔️'}
              </button>
            )}

            {(!battle.participants || battle.participants.length < 2) && (
              <p className="waiting-message">Waiting for at least 2 players...</p>
            )}
          </div>
        </div>
      )}

      {/* Live Battle */}
      {mode === 'battle' && (
        <div className="battle-room">
          <div className="live-leaderboard-card">
            <h2>🏆 Live Leaderboard</h2>
            <div className="leaderboard-list">
              {leaderboard.map((p) => (
                <div key={p.userId} className="leaderboard-item">
                  <div className="rank">{getRankEmoji(p.rank)}</div>
                  <div className="player-name">{p.name}</div>
                  <div className="player-stats">
                    <span>⚡ {p.score}</span>
                    <span>✓ {p.correctCount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2>⚔️ Battle in Progress!</h2>
            <p>Live challenges coming soon...</p>
            <p>This will show the current challenge with timer</p>
            <button className="btn btn-secondary" onClick={onBack}>
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LiveBattle;
