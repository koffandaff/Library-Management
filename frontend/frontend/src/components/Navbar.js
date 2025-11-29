import React, { useState } from 'react';
import './styles/Navbar.css';

const Navbar = ({ isLoggedIn, userRole, onLogout, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigation = (page) => {
    if (onNavigate) {
      onNavigate(page);
    }
    // Close mobile menu after navigation
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    // Close mobile menu after logout
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Common navigation items
  const navItems = [
    { key: 'home', label: 'Home' },
    { key: 'books', label: 'Books' },
    { key: 'authors', label: 'Authors' },
    ...(isLoggedIn ? [{ key: 'personal-checkout-history', label: 'My Checkouts' }] : []),
    ...(isLoggedIn && userRole === 'admin' ? [{ key: 'checkout-history', label: 'All Checkouts' }] : [])
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand/Logo */}
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
        
        {/* Desktop Navigation */}
        <nav className="navbar-nav">
          {navItems.map(item => (
            <a 
              key={item.key}
              href={`#${item.key}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation(item.key);
              }} 
              className="nav-item"
            >
              {item.label}
            </a>
          ))}
        </nav>
        
        {/* Desktop Profile Section */}
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
                  <span className="material-symbols-outlined">dashboard</span>
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
                  <span className="material-symbols-outlined">add</span>
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
                <span className="material-symbols-outlined">person</span>
                <span>Profile</span>
              </a>
              
              <button 
                onClick={handleLogout}
                className="profile-link logout-btn"
              >
                <span className="material-symbols-outlined">logout</span>
                <span>Logout</span>
              </button>
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
                <span className="material-symbols-outlined">login</span>
                <span>Login</span>
              </a>
              <a 
                href="#register" 
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation('register');
                }} 
                className="profile-link login-btn"
              >
                <span className="material-symbols-outlined">person_add</span>
                <span>Register</span>
              </a>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Mobile Menu Overlay */}
        <div 
          className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={closeMobileMenu}
        ></div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          {/* Mobile Navigation */}
          <nav className="mobile-nav">
            {navItems.map(item => (
              <a 
                key={item.key}
                href={`#${item.key}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation(item.key);
                }} 
                className="mobile-nav-item"
              >
                <span className="material-symbols-outlined">
                  {item.key === 'home' && 'home'}
                  {item.key === 'books' && 'menu_book'}
                  {item.key === 'authors' && 'groups'}
                  {item.key === 'personal-checkout-history' && 'receipt_long'}
                  {item.key === 'checkout-history' && 'history'}
                </span>
                {item.label}
              </a>
            ))}
          </nav>

          {/* Mobile Profile Section */}
          <div className="mobile-profile-section">
            {isLoggedIn ? (
              <>
                {userRole === 'admin' && (
                  <a 
                    href="#admin-dashboard" 
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation('admin-dashboard');
                    }} 
                    className="mobile-profile-link"
                  >
                    <span className="material-symbols-outlined">dashboard</span>
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
                    className="mobile-profile-link"
                  >
                    <span className="material-symbols-outlined">add</span>
                    <span>Add Book</span>
                  </a>
                )}
                
                <a 
                  href="#profile" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation('profile');
                  }} 
                  className="mobile-profile-link"
                >
                  <span className="material-symbols-outlined">person</span>
                  <span>Profile</span>
                </a>
                
                <button 
                  onClick={handleLogout}
                  className="mobile-profile-link mobile-logout-btn"
                >
                  <span className="material-symbols-outlined">logout</span>
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <a 
                  href="#login" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation('login');
                  }} 
                  className="mobile-profile-link"
                >
                  <span className="material-symbols-outlined">login</span>
                  <span>Login</span>
                </a>
                <a 
                  href="#register" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation('register');
                  }} 
                  className="mobile-profile-link mobile-login-btn"
                >
                  <span className="material-symbols-outlined">person_add</span>
                  <span>Register</span>
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;