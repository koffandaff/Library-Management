import React, { useState, useEffect } from 'react';
import api, { Api_Endpoints } from '../service/api';
import './Home.css';

const Home = ({ isLoggedIn, onNavigate }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserData();
    }
  }, [isLoggedIn]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await api.get(Api_Endpoints.AUTH.CURRENT);
      console.log('User data response:', response.data);
      
      // Extract user data from nested structure (same as Profile component)
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
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (page) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  const handleFeatureClick = (e, page) => {
    e.preventDefault();
    handleNavigation(page);
  };

  return (
    <div className="home-container">
      {/* Background Elements */}
      <div className="home-background">
        <div className="bg-blob bg-blob-1"></div>
        <div className="bg-blob bg-blob-2"></div>
        <div className="bg-blob bg-blob-3"></div>
      </div>

      <div className="home-content">
        {/* Guest View */}
        {!isLoggedIn && (
          <div className="guest-view">
            <div className="welcome-section">
              <div className="welcome-badge">
                <span>🚀 SmartLibrary</span>
              </div>
              <h1 className="welcome-title">
                Welcome to <span className="gradient-text">SmartLibrary</span>
              </h1>
              <p className="welcome-subtitle">
                Your digital gateway to a world of knowledge. Access thousands of books, 
                connect with authors, and manage your reading journey all in one place.
              </p>
              <div className="action-buttons">
                <button 
                  className="btn btn-primary" 
                  onClick={() => handleNavigation('login')}
                >
                  <span className="btn-icon">→</span>
                  Get Started
                </button>
                <button 
                  className="btn btn-outline" 
                  onClick={() => handleNavigation('register')}
                >
                  Create Account
                </button>
              </div>
            </div>

            {/* Features Preview for Guests */}
            <div className="features-preview">
              <h2 className="features-title">Why Choose SmartLibrary?</h2>
              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon">📚</div>
                  <div className="feature-content">
                    <h3 className="feature-title">Extensive Collection</h3>
                    <p className="feature-description">
                      Access thousands of books across all genres and subjects
                    </p>
                  </div>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">⚡</div>
                  <div className="feature-content">
                    <h3 className="feature-title">Instant Access</h3>
                    <p className="feature-description">
                      Digital borrowing and reading available 24/7 from any device
                    </p>
                  </div>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">🔍</div>
                  <div className="feature-content">
                    <h3 className="feature-title">Smart Search</h3>
                    <p className="feature-description">
                      Advanced search and recommendations tailored to your interests
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Authenticated User View */}
        {isLoggedIn && (
          <div className="user-view">
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner">👤</div>
                <p>Loading your profile...</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <div className="error-icon">❌</div>
                <h3>{error}</h3>
                <button onClick={fetchUserData} className="primary-btn">
                  Try Again
                </button>
              </div>
            ) : (
              <>
                <div className="welcome-section">
                  <div className="user-greeting">
                    <h1 className="welcome-title">
                      Welcome back, <span className="user-name">{userData?.name || 'User'}!</span>
                    </h1>
                    <p className="welcome-subtitle">
                      Ready to continue your reading journey? Here's what you can do today.
                    </p>
                  </div>
                </div>
                
                <div className="features-grid">
                  <div 
                    className="feature-card" 
                    onClick={(e) => handleFeatureClick(e, 'books')}
                  >
                    <div className="feature-icon-wrapper">
                      <span className="material-symbols-outlined feature-icon">📚</span>
                    </div>
                    <div className="feature-content">
                      <h3 className="feature-title">Explore Books</h3>
                      <p className="feature-description">
                        Browse our collection, search for specific titles, and discover your next favorite read.
                      </p>
                    </div>
                    <div className="feature-arrow">→</div>
                  </div>
                  
                  <div 
                    className="feature-card" 
                    onClick={(e) => handleFeatureClick(e, 'authors')}
                  >
                    <div className="feature-icon-wrapper">
                      <span className="material-symbols-outlined feature-icon">✍️</span>
                    </div>
                    <div className="feature-content">
                      <h3 className="feature-title">Discover Authors</h3>
                      <p className="feature-description">
                        Learn about your favorite authors and discover new literary voices.
                      </p>
                    </div>
                    <div className="feature-arrow">→</div>
                  </div>
                  
                  <div 
                    className="feature-card" 
                    onClick={(e) => handleFeatureClick(e, 'personal-checkout-history')}
                  >
                    <div className="feature-icon-wrapper">
                      <span className="material-symbols-outlined feature-icon">🛒</span>
                    </div>
                    <div className="feature-content">
                      <h3 className="feature-title">My Checkouts</h3>
                      <p className="feature-description">
                        Manage your current loans, view history, and track return dates.
                      </p>
                    </div>
                    <div className="feature-arrow">→</div>
                  </div>

                  <div 
                    className="feature-card" 
                    onClick={(e) => handleFeatureClick(e, 'profile')}
                  >
                    <div className="feature-icon-wrapper">
                      <span className="material-symbols-outlined feature-icon">👤</span>
                    </div>
                    <div className="feature-content">
                      <h3 className="feature-title">My Profile</h3>
                      <p className="feature-description">
                        Update your preferences, reading interests, and account settings.
                      </p>
                    </div>
                    <div className="feature-arrow">→</div>
                  </div>

                  {userData?.role === 'admin' && (
                    <div 
                      className="feature-card admin-card" 
                      onClick={(e) => handleFeatureClick(e, 'admin-dashboard')}
                    >
                      <div className="feature-icon-wrapper">
                        <span className="material-symbols-outlined feature-icon">⭐</span>
                      </div>
                      <div className="feature-content">
                        <h3 className="feature-title">Admin Dashboard</h3>
                        <p className="feature-description">
                          Manage library system, users, and content administration.
                        </p>
                      </div>
                      <div className="feature-arrow">→</div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  ); 
};

export default Home;