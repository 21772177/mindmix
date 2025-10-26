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
  const [activeMode, setActiveMode] = useState('play'); // 'play' or 'learn'

  const handleLogin = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    setView('dashboard');
  };

  const GlobalHeader = () => (
    <div style={{
      background: 'linear-gradient(135deg, #007BFF 0%, #8A2BE2 100%)',
      color: 'white',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          background: 'white',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontFamily: '"Inter", "Poppins", sans-serif'
        }}>
          🧠 MindMix+
        </div>
        <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
          Play Smart. Learn Faster.
        </div>
      </div>
      
      {/* Mode Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={() => setActiveMode('play')}
          style={{
            padding: '0.5rem 1.5rem',
            background: activeMode === 'play' ? 'rgba(255,255,255,0.3)' : 'transparent',
            border: '2px solid white',
            borderRadius: '20px',
            color: 'white',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.3s'
          }}
        >
          🎵 Play Mode
        </button>
        <button
          onClick={() => setActiveMode('learn')}
          style={{
            padding: '0.5rem 1.5rem',
            background: activeMode === 'learn' ? 'rgba(255,255,255,0.3)' : 'transparent',
            border: '2px solid white',
            borderRadius: '20px',
            color: 'white',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.3s'
          }}
        >
          📚 Learn Mode
        </button>
      </div>
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
      {view !== 'login' && <GlobalHeader />}
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
          {/* Show content based on active mode */}
          {activeMode === 'play' && (
            <div style={{ padding: '1rem' }}>
              <div style={{ 
                display: 'flex', 
                gap: '1rem', 
                marginBottom: '1.5rem',
                flexWrap: 'wrap'
              }}>
                <button 
                  onClick={() => setView('beatrush')} 
                  className="btn btn-primary"
                  style={{
                    background: 'linear-gradient(135deg, #007BFF 0%, #8A2BE2 100%)',
                    border: 'none',
                    color: 'white',
                    padding: '1rem 2rem',
                    fontSize: '1.1rem',
                    borderRadius: '8px'
                  }}
                >
                  🎵 BeatRush
                </button>
                <button 
                  onClick={() => setView('group')} 
                  className="btn btn-primary"
                >
                  👥 Group Play
                </button>
                <button 
                  onClick={() => setView('battle')} 
                  className="btn btn-primary"
                >
                  ⚔️ Live Battle
                </button>
              </div>
              <Dashboard 
                user={user} 
                token={token} 
                onLogout={handleLogout}
                onStartChallenge={handleStartChallenge}
                onStartGroupMode={() => setView('group')}
                onStartBattle={() => setView('battle')}
                onStartKnowledge={() => setView('knowledge')}
                onOpenProfile={() => setView('profile')}
                onStartBeatRush={() => setView('beatrush')}
              />
            </div>
          )}
          
          {activeMode === 'learn' && (
            <KnowledgeZone 
              user={user}
              token={token}
              onBack={() => setView('dashboard')}
            />
          )}
          
          {/* Shared Leaderboard */}
          <div style={{ padding: '1rem' }}>
            <SharedLeaderboard user={user} token={token} activeMode={activeMode} />
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
        <ChallengeView 
          challenge={currentChallenge}
          token={token}
          user={user}
          onBack={() => setView('dashboard')}
          onNextChallenge={handleNextChallenge}
        />
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
