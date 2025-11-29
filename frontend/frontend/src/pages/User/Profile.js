import React, { useState, useEffect } from 'react';
import api, { Api_Endpoints } from '../../service/api';
import './styles/Profile.css';

const Profile = ({ onNavigate, isLoggedIn, userRole }) => {
  const [userData, setUserData] = useState(null);
  const [userStats, setUserStats] = useState({ 
    booksCheckedOut: 0,
    totalCheckouts: 0,
    activeCheckouts: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserData();
      fetchUserStats();
    }
  }, [isLoggedIn]);

  const fetchUserData = async () => {
    try {
      const response = await api.get(Api_Endpoints.AUTH.CURRENT);
      console.log('User data response:', response.data);
      
      // Extract user data from nested structure
      let userDataFromResponse = null;
      if (response.data.user && response.data.user.user) {
        userDataFromResponse = response.data.user.user;
      } else if (response.data.user) {
        userDataFromResponse = response.data.user;
      } else {
        userDataFromResponse = response.data;
      }
      
      setUserData(userDataFromResponse);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await api.get(Api_Endpoints.CHECKOUT.PERSONAL_HISTORY);
      const checkouts = response.data.data || response.data.message || [];
      
      const activeCheckouts = checkouts.filter(checkout => !checkout.returnDate).length;
      const totalCheckouts = checkouts.length;
      
      setUserStats({
        booksCheckedOut: activeCheckouts,
        totalCheckouts: totalCheckouts,
        activeCheckouts: activeCheckouts
      });
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    }
  };

  const handleViewCheckouts = () => {
    if (onNavigate) {
      onNavigate('personal-checkout-history');
    }
  };

  const handleBrowseBooks = () => {
    if (onNavigate) {
      onNavigate('books');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="profile-container">
        <div className="not-logged-in">
          <div className="error-icon">🔒</div>
          <h2>Authentication Required</h2>
          <p>Please log in to view your profile</p>
          <button onClick={() => onNavigate('login')} className="primary-btn">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-state">
          <div className="loading-spinner">👤</div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="profile-container">
        <div className="error-state">
          <div className="error-icon">❌</div>
          <h3>{error || 'No user data found'}</h3>
          <button onClick={() => window.location.reload()} className="primary-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-content">
        {/* Breadcrumbs */}
        <div className="breadcrumbs">
          <button className="breadcrumb-link" onClick={() => onNavigate('home')}>Home</button>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Profile</span>
        </div>

        <div className="profile-header">
          <h1>User Profile</h1>
          <p>Manage your account and view your library activity</p>
        </div>

        <div className="profile-grid">
          {/* User Info Card */}
          <div className="profile-card user-info-card">
            <div className="card-header">
              <h2>Personal Information</h2>
            </div>
            <div className="user-avatar-section">
              <div className="user-avatar">
                <span className="avatar-icon">👤</span>
              </div>
              <div className="user-details">
                <h3 className="user-name">{userData.name}</h3>
                <p className="user-email">{userData.email}</p>
                <div className={`role-badge ${userData.role}`}>
                  {userData.role}
                </div>
              </div>
            </div>
            <div className="user-meta">
              <div className="meta-item">
                <span className="meta-label">Member Since</span>
                <span className="meta-value">
                  {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="profile-card stats-card">
            <div className="card-header">
              <h2>Library Statistics</h2>
            </div>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon">📚</div>
                <div className="stat-content">
                  <h3 className="stat-number">{userStats.activeCheckouts}</h3>
                  <p className="stat-label">Currently Borrowed</p>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">📖</div>
                <div className="stat-content">
                  <h3 className="stat-number">{userStats.totalCheckouts}</h3>
                  <p className="stat-label">Total Checkouts</p>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">⭐</div>
                <div className="stat-content">
                  <h3 className="stat-number">
                    {userData.role === 'admin' ? 'Admin' : 'Member'}
                  </h3>
                  <p className="stat-label">Account Type</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="profile-card actions-card">
            <div className="card-header">
              <h2>Quick Actions</h2>
            </div>
            <div className="action-buttons">
              <button className="action-btn primary" onClick={handleBrowseBooks}>
                <span className="btn-icon">📚</span>
                <span>Browse Books</span>
              </button>
              <button className="action-btn secondary" onClick={handleViewCheckouts}>
                <span className="btn-icon">📖</span>
                <span>My Checkouts</span>
              </button>
              {userRole === 'admin' && (
                <button 
                  className="action-btn admin" 
                  onClick={() => onNavigate('admin-dashboard')}
                >
                  <span className="btn-icon">⚙️</span>
                  <span>Admin Dashboard</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;