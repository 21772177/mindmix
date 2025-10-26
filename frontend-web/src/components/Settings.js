import React, { useState } from 'react';
import './Settings.css';

function Settings({ user, onLogout }) {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [autoSubmit, setAutoSubmit] = useState(false);
  const [showTimer, setShowTimer] = useState(true);
  const [difficulty, setDifficulty] = useState('easy');

  const handleSaveSettings = () => {
    const settings = {
      audioEnabled,
      autoSubmit,
      showTimer,
      defaultDifficulty: difficulty
    };
    localStorage.setItem('userSettings', JSON.stringify(settings));
    alert('Settings saved!');
  };

  return (
    <div className="settings-container">
      <div className="card">
        <h2>⚙️ App Settings</h2>
        
        <div className="settings-section">
          <h3>Audio Settings</h3>
          <div className="setting-item">
            <label className="switch">
              <input 
                type="checkbox" 
                checked={audioEnabled}
                onChange={(e) => setAudioEnabled(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
            <div className="setting-info">
              <strong>Enable Audio</strong>
              <p>Hear questions and answers read aloud</p>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3>Game Settings</h3>
          <div className="setting-item">
            <label className="switch">
              <input 
                type="checkbox" 
                checked={showTimer}
                onChange={(e) => setShowTimer(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
            <div className="setting-info">
              <strong>Show Timer</strong>
              <p>Display countdown timer for answers</p>
            </div>
          </div>

          <div className="setting-item">
            <label className="switch">
              <input 
                type="checkbox" 
                checked={autoSubmit}
                onChange={(e) => setAutoSubmit(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
            <div className="setting-info">
              <strong>Auto-Submit</strong>
              <p>Automatically submit when timer expires</p>
            </div>
          </div>

          <div className="form-group">
            <label>Default Difficulty</label>
            <select 
              value={difficulty} 
              onChange={(e) => setDifficulty(e.target.value)}
              className="select-input"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <div className="settings-section">
          <h3>Account</h3>
          <button className="btn btn-danger" onClick={onLogout}>
            🔓 Logout
          </button>
        </div>

        <button className="btn btn-primary" onClick={handleSaveSettings}>
          💾 Save Settings
        </button>
      </div>
    </div>
  );
}

export default Settings;
