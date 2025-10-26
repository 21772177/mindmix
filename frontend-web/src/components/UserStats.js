import React from 'react';
import './UserStats.css';

function UserStats({ user, stats }) {
  const level = stats?.level || user?.level || 1;
  const stage = stats?.stage || user?.stage || 1;
  const totalXP = stats?.totalXP || user?.totalXP || 0;
  const coins = stats?.coins || user?.coins || 0;
  const streak = stats?.streak || user?.streak || 0;
  
  // Calculate XP needed for next level
  const currentLevelXP = Math.pow(level - 1, 2) * 10;
  const nextLevelXP = Math.pow(level, 2) * 10;
  const xpNeeded = nextLevelXP - currentLevelXP;
  const currentProgress = totalXP - currentLevelXP;
  const xpPercent = Math.min((currentProgress / xpNeeded) * 100, 100);

  return (
    <div className="user-stats-container">
      <div className="stats-header">
        <h2>Your Progress</h2>
      </div>

      <div className="stats-grid">
        {/* Level & Stage */}
        <div className="stat-card level-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-info">
            <div className="stat-label">Level</div>
            <div className="stat-value">{level}</div>
          </div>
        </div>

        <div className="stat-card stage-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-info">
            <div className="stat-label">Stage</div>
            <div className="stat-value">{stage}</div>
          </div>
        </div>

        {/* XP Progress */}
        <div className="stat-card xp-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-info">
            <div className="stat-label">XP</div>
            <div className="stat-value">{totalXP.toLocaleString()}</div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${xpPercent}%` }}
              ></div>
            </div>
            <div className="progress-text">
              {currentProgress.toLocaleString()} / {xpNeeded.toLocaleString()} to Level {level + 1}
            </div>
          </div>
        </div>

        {/* Coins */}
        <div className="stat-card coins-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <div className="stat-label">Coins</div>
            <div className="stat-value">{coins.toLocaleString()}</div>
          </div>
        </div>

        {/* Streak */}
        <div className="stat-card streak-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-info">
            <div className="stat-label">Streak</div>
            <div className="stat-value">{streak}</div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      {stats?.categories && (
        <div className="categories-section">
          <h3>Challenge Types</h3>
          <div className="categories-grid">
            {Object.entries(stats.categories).map(([category, count]) => (
              <div key={category} className="category-item">
                <span className="category-emoji">
                  {category === 'music' && '🎵'}
                  {category === 'logic' && '🧩'}
                  {category === 'trivia' && '📚'}
                  {category === 'creative' && '🎨'}
                  {category === 'math' && '🔢'}
                </span>
                <span className="category-name">{category}</span>
                <span className="category-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserStats;
