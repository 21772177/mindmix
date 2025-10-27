import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ChallengeView from './components/ChallengeView';
import GroupMode from './components/GroupMode';
import LiveBattle from './components/LiveBattle';
import KnowledgeZone from './components/KnowledgeZone';
import UserProfile from './components/UserProfile';
import BeatRush from './components/BeatRush';
import SharedLeaderboard from './components/SharedLeaderboard';
import API_URL from './config/api';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [view, setView] = useState('login'); // login, dashboard, challenge, group, battle, knowledge, profile, beatrush
  const [activeMode, setActiveMode] = useState(null); // null = main dashboard, 'play', 'learn', 'profile' = inside mode

  const handleLogin = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    setView('dashboard');
  };

  const GlobalHeader = ({ showTabs = true, onBack = null }) => (
    <div style={{
      background: 'linear-gradient(135deg, #007BFF 0%, #8A2BE2 100%)',
      color: 'white',
      padding: '1rem 2rem',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          🧠 MindMix+ 
          <span style={{ fontSize: '0.8rem', fontWeight: 'normal', opacity: 0.9 }}>
            play smart.learn smart
          </span>
        </div>
        
        {onBack && (
          <button
            onClick={onBack}
            style={{
              padding: '0.5rem 1.5rem',
              background: 'rgba(255,255,255,0.2)',
              border: '2px solid white',
              borderRadius: '20px',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s'
            }}
          >
            ← Back to Main
          </button>
        )}
      </div>
      
      {/* Three Navigation Tabs - Only show on main dashboard */}
      {showTabs && (
        <div style={{ 
          display: 'flex', 
          gap: '1rem',
          marginTop: '1rem'
        }}>
          <button
            onClick={() => setActiveMode('play')}
            style={{
              padding: '0.5rem 1.5rem',
              background: 'rgba(255,255,255,0.3)',
              border: '2px solid white',
              borderRadius: '20px',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            🎵 Play Mode
          </button>
          <button
            onClick={() => setActiveMode('learn')}
            style={{
              padding: '0.5rem 1.5rem',
              background: 'rgba(255,255,255,0.3)',
              border: '2px solid white',
              borderRadius: '20px',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            📚 Learn Mode
          </button>
          <button
            onClick={() => setActiveMode('profile')}
            style={{
              padding: '0.5rem 1.5rem',
              background: 'rgba(255,255,255,0.3)',
              border: '2px solid white',
              borderRadius: '20px',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            👤 Profile
          </button>
        </div>
      )}
    </div>
  );

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setView('login');
  };

  const handleStartChallenge = (challenge) => {
    setCurrentChallenge(challenge);
    setView('challenge');
  };

  const handleNextChallenge = async () => {
    // Generate next challenge automatically
    try {
      // Get random type and difficulty for variety
      const types = ['logic', 'trivia', 'creative']; // Only 3 types
      const difficulties = ['easy', 'medium', 'hard'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      const randomDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
      
      const response = await axios.get(`${API_URL}/ai/generate`, {
        params: { 
          type: randomType, 
          difficulty: randomDifficulty,
          userId: user?.id 
        }
      });
      
      if (response.data.ok) {
        setCurrentChallenge(response.data.data);
      } else {
        // If generation fails, go back to dashboard
        setView('dashboard');
      }
    } catch (err) {
      console.error('Failed to generate next challenge:', err);
      setView('dashboard');
    }
  };

  return (
    <div className="App">
      {view !== 'login' && <GlobalHeader showTabs={activeMode === null && view !== 'challenge'} onBack={view === 'challenge' ? () => setView('dashboard') : (activeMode !== null ? () => setActiveMode(null) : null)} />}
      {view === 'login' && (
        <div style={{
          background: 'linear-gradient(135deg, #007BFF 0%, #8A2BE2 100%)',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div>
            <div style={{
              textAlign: 'center',
              marginBottom: '2rem',
              color: 'white'
            }}>
              <div style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                marginBottom: '0.5rem'
              }}>
                🧠 MindMix+
              </div>
              <div style={{
                fontSize: '1.2rem',
                opacity: 0.9
              }}>
                Play Smart. Learn Faster.
              </div>
            </div>
            <Login onLogin={handleLogin} />
          </div>
        </div>
      )}
      {view === 'dashboard' && (
        <>
          {/* MAIN DASHBOARD - Show when no mode is selected */}
          {activeMode === null && (
            <div style={{ padding: '2rem', backgroundColor: '#f0f8ff', minHeight: '100vh' }}>
              <div style={{ 
                maxWidth: '1200px', 
                margin: '0 auto'
              }}>
                <Dashboard 
                  user={user} 
                  token={token} 
                  onLogout={handleLogout}
                  onStartChallenge={handleStartChallenge}
                  onStartGroupMode={() => setView('group')}
                  onStartBattle={() => setView('battle')}
                  onStartKnowledge={() => setView('knowledge')}
                  onOpenProfile={() => setActiveMode('profile')}
                  onStartBeatRush={() => setView('beatrush')}
                  activeMode={null}
                />
                
                {/* Leaderboard - Always visible on main dashboard */}
                <div style={{ marginTop: '2rem' }}>
                  <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '2rem',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                  }}>
                    <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>🏆 Leaderboard (Play Mode)</h2>
                    <SharedLeaderboard user={user} token={token} activeMode={null} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Show full mode page when a mode is selected */}
          {activeMode === 'play' && (
            <div style={{ padding: '2rem', backgroundColor: '#f0f8ff', minHeight: '100vh' }}>
              <div style={{ 
                maxWidth: '1200px', 
                margin: '0 auto',
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '2rem',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}>
                <Dashboard 
                  user={user} 
                  token={token} 
                  onLogout={handleLogout}
                  onStartChallenge={handleStartChallenge}
                  onStartGroupMode={() => setView('group')}
                  onStartBattle={() => setView('battle')}
                  onStartKnowledge={() => setView('knowledge')}
                  onOpenProfile={() => setActiveMode('profile')}
                  onStartBeatRush={() => setView('beatrush')}
                  activeMode={activeMode}
                />
                
              </div>
            </div>
          )}
          
          {activeMode === 'learn' && (
            <div style={{ padding: '2rem', backgroundColor: '#f0f8ff', minHeight: '100vh' }}>
              <div style={{ 
                maxWidth: '1200px', 
                margin: '0 auto',
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '2rem',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}>
                <KnowledgeZone 
                  user={user}
                  token={token}
                  onBack={() => setView('dashboard')}
                />
              </div>
            </div>
          )}

          {activeMode === 'profile' && (
            <div style={{ padding: '2rem', backgroundColor: '#f0f8ff', minHeight: '100vh' }}>
              <div style={{ 
                maxWidth: '1200px', 
                margin: '0 auto',
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '2rem',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}>
                <UserProfile 
                  user={user}
                  token={token}
                  onBack={() => setView('dashboard')}
                  onLogout={handleLogout}
                />
              </div>
            </div>
          )}

          {/* Leaderboard - Always visible on main app UI, below content */}
          <div style={{ padding: '2rem', backgroundColor: '#f0f8ff' }}>
            <div style={{ 
              maxWidth: '1200px', 
              margin: '0 auto',
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>🏆 Leaderboard (Play Mode)</h2>
              <SharedLeaderboard user={user} token={token} activeMode={activeMode} />
            </div>
          </div>
        </>
      )}
      {view === 'beatrush' && (
        <BeatRush 
          user={user}
          token={token}
          onBack={() => setView('dashboard')}
        />
      )}
      {view === 'challenge' && (
        <div style={{ padding: '2rem', backgroundColor: '#f0f8ff', minHeight: '100vh' }}>
          <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto',
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <ChallengeView 
              challenge={currentChallenge}
              token={token}
              user={user}
              onBack={() => setView('dashboard')}
              onNextChallenge={handleNextChallenge}
            />
          </div>
        </div>
      )}
      {view === 'group' && (
        <GroupMode 
          user={user}
          token={token}
          onBack={() => setView('dashboard')}
        />
      )}
      {view === 'battle' && (
        <LiveBattle 
          user={user}
          token={token}
          onBack={() => setView('dashboard')}
        />
      )}
      {view === 'knowledge' && (
        <KnowledgeZone 
          user={user}
          token={token}
          onBack={() => setView('dashboard')}
        />
      )}
      {view === 'profile' && (
        <UserProfile 
          user={user}
          token={token}
          onBack={() => setView('dashboard')}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;
