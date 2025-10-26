import React, { useState } from 'react';
import axios from 'axios';
import API_URL from '../config/api';
import './Login.css';

function Login({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const data = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      // Build full URL with proper protocol handling
      let fullUrl;
      if (API_URL && API_URL.startsWith('http')) {
        fullUrl = `${API_URL}${endpoint}`;
      } else {
        // Fallback if API_URL is not set correctly
        fullUrl = `https://mindmix-backend-8sx7xr6ok-nikhilesh-shinganes-projects.vercel.app${endpoint}`;
      }
      
      console.log('🔗 API_URL value:', API_URL);
      console.log('📡 Full URL:', fullUrl);
      console.log('🌐 Window origin:', window.location.origin);
      
      const response = await axios.post(fullUrl, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.ok) {
        onLogin(response.data.data.user, response.data.data.token);
      } else {
        setError(response.data.error || 'Something went wrong');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 style={{
          background: 'linear-gradient(135deg, #007BFF 0%, #8A2BE2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontSize: '2.5rem',
          marginBottom: '0.5rem'
        }}>
          🧠 MindMix+
        </h1>
        <p className="subtitle">Play Smart. Learn Faster.</p>
        
        <div className="auth-tabs">
          <button 
            className={`tab ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button 
            className={`tab ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>

          {error && <div className="error">{error}</div>}
          
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Loading...' : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
