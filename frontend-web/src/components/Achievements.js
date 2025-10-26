import React from 'react';
import './Achievements.css';

function Achievements({ user, stats }) {
  const level = user?.level || 1;
  const totalXP = stats?.totalXP || user?.totalXP || 0;
  const coins = stats?.coins || user?.coins || 0;
  const streak = stats?.streak || user?.streak || 0;
  const correctCount = stats?.correct || 0;
  const total = stats?.total || 0;

  // Calculate achievements (expanded list)
  const achievements = [
    {
      id: 'first_play',
      title: 'First Steps',
      description: 'Complete your first challenge',
      icon: '🎯',
      unlocked: total >= 1,
      tier: 'bronze'
    },
    {
      id: 'friend_maker',
      title: 'Social Butterfly',
      description: 'Add 5 friends',
      icon: '👥',
      unlocked: false, // Would need friend count
      tier: 'silver'
    },
    {
      id: 'group_player',
      title: 'Team Player',
      description: 'Join 10 group games',
      icon: '🎮',
      unlocked: false, // Would need group count
      tier: 'gold'
    },
    {
      id: 'battle_master',
      title: 'Battle Master',
      description: 'Win 5 live battles',
      icon: '⚔️',
      unlocked: false, // Would need battle wins
      tier: 'platinum'
    },
    {
      id: 'knowledge_seeker',
      title: 'Knowledge Seeker',
      description: 'Complete 20 quizzes',
      icon: '📚',
      unlocked: false, // Would need quiz count
      tier: 'silver'
    },
    {
      id: 'streak_5',
      title: 'Getting Hot',
      description: 'Get a 5 question streak',
      icon: '🔥',
      unlocked: streak >= 5,
      tier: 'silver'
    },
    {
      id: 'streak_10',
      title: 'On Fire',
      description: 'Get a 10 question streak',
      icon: '🔥🔥',
      unlocked: streak >= 10,
      tier: 'gold'
    },
    {
      id: 'perfect_10',
      title: 'Perfectionist',
      description: 'Get 10 correct answers in a row',
      icon: '✨',
      unlocked: correctCount >= 10,
      tier: 'platinum'
    },
    {
      id: 'level_10',
      title: 'Rising Star',
      description: 'Reach Level 10',
      icon: '⭐',
      unlocked: level >= 10,
      tier: 'gold'
    },
    {
      id: 'level_25',
      title: 'Champion',
      description: 'Reach Level 25',
      icon: '🌟',
      unlocked: level >= 25,
      tier: 'platinum'
    },
    {
      id: 'coins_1000',
      title: 'Wealthy',
      description: 'Earn 1000 coins',
      icon: '💰',
      unlocked: coins >= 1000,
      tier: 'gold'
    },
    {
      id: 'challenges_50',
      title: 'Dedicated',
      description: 'Complete 50 challenges',
      icon: '🏅',
      unlocked: total >= 50,
      tier: 'silver'
    },
    {
      id: 'perfect_day',
      title: 'Perfect Day',
      description: 'Get 100% accuracy for a day',
      icon: '💯',
      unlocked: false,
      tier: 'gold'
    },
    {
      id: 'night_owl',
      title: 'Night Owl',
      description: 'Play challenges at night',
      icon: '🦉',
      unlocked: false,
      tier: 'bronze'
    },
    {
      id: 'early_bird',
      title: 'Early Bird',
      description: 'Play challenges in the morning',
      icon: '🐦',
      unlocked: false,
      tier: 'bronze'
    },
    {
      id: 'speed_demon',
      title: 'Speed Demon',
      description: 'Answer 10 challenges in under 1 minute',
      icon: '⚡',
      unlocked: false,
      tier: 'platinum'
    },
    {
      id: 'category_master',
      title: 'Category Master',
      description: 'Get 100 points in all categories',
      icon: '🎨',
      unlocked: false,
      tier: 'platinum'
    },
    {
      id: 'marathon',
      title: 'Marathon Runner',
      description: 'Play for 100 days in a row',
      icon: '🏃',
      unlocked: false,
      tier: 'platinum'
    }
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalAchievements = achievements.length; // Now 20 achievements!

  const getTierColor = (tier) => {
    const colors = {
      bronze: '#cd7f32',
      silver: '#c0c0c0',
      gold: '#ffd700',
      platinum: '#e5e4e2'
    };
    return colors[tier] || '#667eea';
  };

  return (
    <div className="achievements-container">
      <div className="achievements-header">
        <h2>🏆 Achievements</h2>
        <div className="achievement-progress">
          <div className="progress-circle">
            <span className="progress-value">{unlockedCount}</span>
            <span className="progress-total">/{totalAchievements}</span>
          </div>
          <p>Unlocked</p>
        </div>
      </div>

      <div className="achievements-grid">
        {achievements.map((achievement) => (
          <div 
            key={achievement.id}
            className={`achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}`}
            style={{
              borderColor: achievement.unlocked ? getTierColor(achievement.tier) : '#ddd'
            }}
          >
            <div className="achievement-icon">{achievement.icon}</div>
            <div className="achievement-info">
              <h3 className={achievement.unlocked ? '' : 'locked-title'}>
                {achievement.title}
              </h3>
              <p className="achievement-desc">{achievement.description}</p>
            </div>
            <div 
              className="achievement-badge"
              style={{ 
                background: achievement.unlocked ? getTierColor(achievement.tier) : '#ddd',
                color: achievement.unlocked ? 'white' : '#999'
              }}
            >
              {achievement.tier.charAt(0).toUpperCase()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Achievements;
