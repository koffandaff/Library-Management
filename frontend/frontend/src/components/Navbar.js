import React from 'react';
import './Navbar.css';

const Navbar = ({ isLoggedIn, userRole, onLogout, onNavigate }) => {
  const handleNavigation = (page) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="brand-icon">
            <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6l-4-4V4a2 2 0 0 1 2-2zm4 10.5a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5H8zM6 6h8a1 1 0 1 1 0 2H6a1 1 0 1 1 0-2z"></path>
            </svg>
          </div>
          <a 
            href="#home" 
            onClick={(e) => {
              e.preventDefault();
              handleNavigation('home');
            }} 
            className="brand-link"
          >
            LibrarySys
          </a>
        </div>
        
        <nav className="navbar-nav">
          <a 
            href="#home" 
            onClick={(e) => {
              e.preventDefault();
              handleNavigation('home');
            }} 
            className="nav-item"
          >
            Home
          </a>
          <a 
            href="#books" 
            onClick={(e) => {
              e.preventDefault();
              handleNavigation('books');
            }} 
            className="nav-item"
          >
            Books
          </a>
          <a 
            href="#authors" 
            onClick={(e) => {
              e.preventDefault();
              handleNavigation('authors');
            }} 
            className="nav-item"
          >
            Authors
          </a>
          {isLoggedIn && (
            <a 
              href="#personal-checkout-history" 
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('personal-checkout-history');
              }} 
              className="nav-item"
            >
              My Checkouts
            </a>
          )}
          {isLoggedIn && userRole === 'admin' && (
            <a 
              href="#checkout-history" 
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('checkout-history');
              }} 
              className="nav-item"
            >
              All Checkouts
            </a>
          )}
        </nav>
        
        <div className="navbar-profile">
          {isLoggedIn ? (
            <>
              {userRole === 'admin' && (
                <a 
                  href="#admin-dashboard" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation('admin-dashboard');
                  }} 
                  className="profile-link admin-link"
                >
                  <span>Dashboard</span>
                </a>
              )}
              
              {userRole === 'admin' && (
                <a 
                  href="#add-book" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation('add-book');
                  }} 
                  className="profile-link"
                >
                  <span>Add Book</span>
                </a>
              )}
              
              <a 
                href="#profile" 
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation('profile');
                }} 
                className="profile-link"
              >
                <span>Profile</span>
              </a>
              
              <a 
                href="#logout" 
                onClick={(e) => {
                  e.preventDefault();
                  handleLogout();
                }} 
                className="profile-link logout-btn"
              >
                <span>Logout</span>
              </a>
            </>
          ) : (
            <>
              <a 
                href="#login" 
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation('login');
                }} 
                className="profile-link"
              >
                <span>Login</span>
              </a>
              <a 
                href="#register" 
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation('register');
                }} 
                className="profile-link register-btn"
              >
                <span>Register</span>
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;