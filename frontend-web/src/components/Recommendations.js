import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Recommendations.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

function Recommendations({ user, token }) {
  const [recommendations, setRecommendations] = useState([]);
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, [token]);

  const fetchRecommendations = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/recommendations/personalized`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.ok) {
        setRecommendations(response.data.data.recommendations.forYou || []);
        setPerformance(response.data.data.performance);
      }
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return null;
  }

  if (loading) {
    return <div className="loading">Loading recommendations...</div>;
  }

  return (
    <div className="recommendations-container">
      <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#333' }}>
        Recommendations for you
      </h2>
      
      {recommendations.length === 0 ? (
        <div className="recommendations-empty" style={{
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: 'rgba(0, 123, 255, 0.05)',
          borderRadius: '12px',
          color: '#666'
        }}>
          <p style={{ margin: 0 }}>Start playing to get personalized recommendations!</p>
        </div>
      ) : (
        <div className="recommendations-list">
          {recommendations.map((rec, index) => (
            <div key={index} className="recommendation-card">
              {rec.type === 'improvement' && (
                <>
                  <div className="rec-icon">📈</div>
                  <div className="rec-content">
                    <h3>Improve Your Skills</h3>
                    <p>{rec.message}</p>
                    {rec.category && (
                      <span className="rec-tag">{rec.category}</span>
                    )}
                  </div>
                </>
              )}
              
              {rec.type === 'progression' && (
                <>
                  <div className="rec-icon">⬆️</div>
                  <div className="rec-content">
                    <h3>Level Up!</h3>
                    <p>{rec.message}</p>
                    <span className="rec-tag">Level {rec.currentLevel}</span>
                  </div>
                </>
              )}
              
              {rec.type === 'streak' && (
                <>
                  <div className="rec-icon">🔥</div>
                  <div className="rec-content">
                    <h3>Keep It Going!</h3>
                    <p>{rec.message}</p>
                    <span className="rec-tag">{rec.currentStreak} streak</span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {performance && (
        <div className="performance-summary">
          <h3>📊 Your Performance</h3>
          <div className="performance-stats">
            <div className="stat-item">
              <div className="stat-label">Strong Areas</div>
              <div className="stat-value">
                {performance.strongCategories.length > 0
                  ? performance.strongCategories.join(', ')
                  : 'Keep playing to find out!'}
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Areas to Improve</div>
              <div className="stat-value">
                {performance.weakCategories.length > 0
                  ? performance.weakCategories.join(', ')
                  : "You're doing great!"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Recommendations;
