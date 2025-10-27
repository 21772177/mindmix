import React from 'react';
import './UserStats.css';

function UserStats({ user, stats }) {
  // Use new stats format
  const level = stats?.level || 1;
  const totalPoints = stats?.totalPoints || 0;
  const correctAnswers = stats?.correctAnswers || 0;
  const wrongAnswers = stats?.wrongAnswers || 0;
  const streak = stats?.streak || 0;
  const highestStreak = stats?.highestStreak || 0;
  
  // Calculate XP needed for next level
  const currentLevelXP = Math.pow(level - 1, 2) * 10;
  const nextLevelXP = Math.pow(level, 2) * 10;
  const xpNeeded = nextLevelXP - currentLevelXP;
  const currentProgress = totalPoints - currentLevelXP;
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
            <div className="stat-label">Accuracy</div>
            <div className="stat-value">
              {totalPoints > 0 ? Math.round((correctAnswers / (correctAnswers + wrongAnswers)) * 100) : 0}%
            </div>
          </div>
        </div>

        {/* XP Progress */}
        <div className="stat-card xp-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-info">
            <div className="stat-label">Total Points</div>
            <div className="stat-value">{totalPoints.toLocaleString()}</div>
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

        {/* Correct Answers */}
        <div className="stat-card coins-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <div className="stat-label">Correct</div>
            <div className="stat-value">{correctAnswers}</div>
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
