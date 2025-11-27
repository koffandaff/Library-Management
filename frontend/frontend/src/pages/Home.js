import React from 'react';
import './Home.css';

const Home = ({ isLoggedIn, onNavigate }) => {
  const handleNavigation = (page) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <div className="home-container">
      <div className="home-content">
        {/* Guest View */}
        {!isLoggedIn && (
          <div className="guest-view">
            <div className="welcome-section">
              <h1 className="welcome-title">Welcome to SmartLibrary</h1>
              <p className="welcome-subtitle">
                Your digital gateway to a world of knowledge. Please log in or create an account to get started.
              </p>
              <div className="action-buttons">
                <button className="btn btn-primary" onClick={() => handleNavigation('login')}>
                  Login
                </button>
                <button className="btn btn-outline" onClick={() => handleNavigation('register')}>
                  Register
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Authenticated User View */}
        {isLoggedIn && (
          <div className="user-view">
            <div className="welcome-section">
              <h1 className="welcome-title">Welcome, User!</h1>
              <p className="welcome-subtitle">What would you like to do today?</p>
            </div>
            
            <div className="features-grid">
              <a href="#books" onClick={() => handleNavigation('books')} className="feature-card">
                <span className="material-symbols-outlined feature-icon">menu_book</span>
                <div className="feature-content">
                  <h3 className="feature-title">Explore Books</h3>
                  <p className="feature-description">Browse, search, and discover your next read.</p>
                </div>
              </a>
              
              <a href="#authors" onClick={() => handleNavigation('authors')} className="feature-card">
                <span className="material-symbols-outlined feature-icon">groups</span>
                <div className="feature-content">
                  <h3 className="feature-title">Find Authors</h3>
                  <p className="feature-description">Learn more about the authors behind the books.</p>
                </div>
              </a>
              
              <a href="#checkouts" onClick={() => handleNavigation('checkouts')} className="feature-card">
                <span className="material-symbols-outlined feature-icon">receipt_long</span>
                <div className="feature-content">
                  <h3 className="feature-title">My Checkouts</h3>
                  <p className="feature-description">View your current loans and borrowing history.</p>
                </div>
              </a>
            </div>
          </div>
        )}
      </div>
      
      
    </div>
  ); 
};

export default Home;