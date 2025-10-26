import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Friends.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

function Friends({ token }) {
  const [friends, setFriends] = useState([]);
  const [pending, setPending] = useState([]);
  const [activeTab, setActiveTab] = useState('friends'); // friends, pending, requests

  useEffect(() => {
    fetchFriends();
    fetchPending();
  }, [token]);

  const fetchFriends = async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${API_URL}/friends`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.data.ok) {
        setFriends(response.data.data.friends);
      }
    } catch (err) {
      console.error('Failed to fetch friends:', err);
    }
  };

  const fetchPending = async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${API_URL}/friends/pending`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.data.ok) {
        setPending(response.data.data.requests);
      }
    } catch (err) {
      console.error('Failed to fetch pending:', err);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      const response = await axios.post(
        `${API_URL}/friends/accept`,
        { requestId },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      if (response.data.ok) {
        fetchFriends();
        fetchPending();
      }
    } catch (err) {
      console.error('Failed to accept:', err);
    }
  };

  if (!token) {
    return <div className="friends-empty">Login to see your friends</div>;
  }

  return (
    <div className="friends-container">
      <h2>👥 Friends</h2>
      
      <div className="friends-tabs">
        <button 
          className={`tab ${activeTab === 'friends' ? 'active' : ''}`}
          onClick={() => setActiveTab('friends')}
        >
          Friends ({friends.length})
        </button>
        <button 
          className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending ({pending.length})
        </button>
      </div>

      {activeTab === 'friends' && (
        <div className="friends-list">
          {friends.length === 0 ? (
            <div className="empty-state">
              <p>No friends yet. Send friend requests to connect!</p>
            </div>
          ) : (
            friends.map((item, index) => (
              <div key={index} className="friend-item">
                <div className="friend-avatar">{item.friend?.name?.[0]?.toUpperCase()}</div>
                <div className="friend-info">
                  <strong>{item.friend?.name}</strong>
                  <span>{item.friend?.email}</span>
                </div>
                <span className="friend-status">✓ Friends</span>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'pending' && (
        <div className="pending-list">
          {pending.length === 0 ? (
            <div className="empty-state">
              <p>No pending friend requests</p>
            </div>
          ) : (
            pending.map((request, index) => (
              <div key={index} className="friend-item">
                <div className="friend-avatar">{request.requester?.name?.[0]?.toUpperCase()}</div>
                <div className="friend-info">
                  <strong>{request.requester?.name}</strong>
                  <span>Wants to be friends</span>
                </div>
                <button 
                  className="btn btn-primary"
                  onClick={() => handleAccept(request._id)}
                >
                  Accept
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Friends;
