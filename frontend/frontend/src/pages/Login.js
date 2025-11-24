import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin, onNavigate }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '' 

  });

  const handleNavigation = () => {
    if(onNavigate){
      onNavigate('register')
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate login - in  app make API call here
    console.log('Login attempt:', formData);
    if (onLogin) {
      onLogin();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="bg-blob bg-blob-1"></div>
        <div className="bg-blob bg-blob-2"></div>
      </div>
      
      <div className="login-card">
        <div className="login-content">
          <div className="login-header">
            <h1 className="login-title">Sign In</h1>
            <p className="login-subtitle">Welcome back to the Library Management System</p>
          </div>
          
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <div className="input-container">
                <span className="material-symbols-outlined input-icon"></span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="form-input"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="input-container">
                <span className="material-symbols-outlined input-icon"></span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="form-input"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <button 
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? "don't show" : "show"}
                  </span>
                </button>
              </div>
            </div>
            
            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="checkbox-input"
                />
                <span className="checkbox-text">Remember Me</span>
              </label>
              <a href="#forgot-password" className="forgot-link">Forgot Password?</a>
            </div>
            
            <button type="submit" className="login-button">
              Login
            </button>
            
            <div className="signup-link">
              <p>Don't have an account? <a href="#register"  onClick={handleNavigation} className="signup-text">Sign Up</a></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;