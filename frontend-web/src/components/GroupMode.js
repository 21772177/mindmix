import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GroupMode.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

function GroupMode({ user, token, onBack }) {
  const [mode, setMode] = useState('select'); // select, create, join, waiting, playing
  const [groupCode, setGroupCode] = useState('');
  const [selectedMode, setSelectedMode] = useState('create'); // create or join
  const [groupName, setGroupName] = useState('');
  const [challengeType, setChallengeType] = useState('music');
  const [difficulty, setDifficulty] = useState('easy');
  const [group, setGroup] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateGroup = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/groups/create`,
        {
          name: groupName || `${user.name}'s Game`,
          challengeType,
          difficulty,
          maxMembers: 10,
          isPrivate: false
        },
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.data.ok) {
        setGroup(response.data.data.group);
        setMode('waiting');
        setGroupCode(response.data.data.group.code);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async () => {
    if (!groupCode || groupCode.length < 4) {
      setError('Please enter a valid group code');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/groups/join`,
        { code: groupCode },
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.data.ok) {
        setGroup(response.data.data.group);
        setMode('waiting');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to join group');
    } finally {
      setLoading(false);
    }
  };

  const handleStartGame = async () => {
    if (!group) return;

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/groups/${group.code}/start`,
        {},
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.data.ok) {
        setMode('playing');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to start game');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group-mode-container">
      <div className="group-mode-header">
        <button className="btn btn-secondary" onClick={onBack}>
          ← Back
        </button>
        <h1>👥 Group Challenge</h1>
      </div>

      {/* Create/Join Selection */}
      {mode === 'select' && (
        <div className="group-selection">
          <div className="selection-tabs">
            <button 
              className={`tab ${selectedMode === 'create' ? 'active' : ''}`}
              onClick={() => setSelectedMode('create')}
            >
              Create Group
            </button>
            <button 
              className={`tab ${selectedMode === 'join' ? 'active' : ''}`}
              onClick={() => setSelectedMode('join')}
            >
              Join Group
            </button>
          </div>

          {/* Create Tab */}
          {selectedMode === 'create' && (
          <div className="card">
            <h2>Create New Group Challenge</h2>
            
            <div className="form-group">
              <label>Group Name</label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder={`${user.name}'s Game`}
              />
            </div>

            <div className="form-group">
              <label>Challenge Type</label>
              <select value={challengeType} onChange={(e) => setChallengeType(e.target.value)}>
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

            {error && <div className="error">{error}</div>}
            
            <button 
              className="btn btn-primary"
              onClick={handleCreateGroup}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Group'}
            </button>
          </div>
          )}

          {/* Join Tab */}
          {selectedMode === 'join' && (
          <div className="card">
            <h2>Join a Group</h2>
            <p>Enter the group code shared by your friend</p>
            
            <div className="form-group">
              <label>Group Code</label>
              <input
                type="text"
                value={groupCode}
                onChange={(e) => setGroupCode(e.target.value.toUpperCase())}
                placeholder="ABC123"
                maxLength="6"
                style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem' }}
              />
            </div>

            {error && <div className="error">{error}</div>}
            
            <button 
              className="btn btn-primary"
              onClick={handleJoinGroup}
              disabled={loading}
            >
              {loading ? 'Joining...' : 'Join Group'}
            </button>
          </div>
          )}
        </div>
      )}

      {/* Waiting Room */}
      {mode === 'waiting' && group && (
        <div className="waiting-room">
          <div className="card">
            <h2>👥 Waiting Room</h2>
            <div className="group-code-display">
              <label>Share this code with friends:</label>
              <div className="code-box">{group.code}</div>
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  navigator.clipboard.writeText(group.code);
                  alert('Code copied!');
                }}
              >
                Copy Code
              </button>
            </div>

            <div className="members-list">
              <h3>Members ({group.members.length}/{group.maxMembers})</h3>
              {group.members.map((member, index) => (
                <div key={index} className="member-item">
                  {member.userId?.name || 'Loading...'}
                  {member.userId?._id?.toString() === group.createdBy?._id?.toString() && 
                    <span className="creator-badge">👑 Creator</span>}
                </div>
              ))}
            </div>

            {group.createdBy?._id?.toString() === user.id && (
              <button 
                className="btn btn-primary"
                onClick={handleStartGame}
                disabled={loading || group.members.length < 2}
              >
                {loading ? 'Starting...' : 'Start Game'}
              </button>
            )}

            {group.members.length < 2 && (
              <p className="waiting-message">Waiting for more players to join...</p>
            )}
          </div>
        </div>
      )}

      {/* Game Started */}
      {mode === 'playing' && (
        <div className="playing-room">
          <div className="card">
            <h2>🎮 Game Started!</h2>
            <p>Group challenges are being prepared...</p>
            <p>This feature will show the live challenge when the game starts.</p>
            <button className="btn btn-secondary" onClick={onBack}>
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GroupMode;
