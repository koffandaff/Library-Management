import React, { useState, useEffect } from 'react';
import './styles/Login.css';

const Login = ({ onLogin, onNavigate }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load remembered credentials
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleNavigation = (route) => {
    if (onNavigate) {
      onNavigate(route);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Save email if remember me is checked
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      await onLogin(formData.email, formData.password);
    } catch (err) {
      setErrors({ 
        submit: err.response?.data?.message || 'Invalid credentials. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSubmit(e);
    }
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
            <div className="login-icon">📚</div>
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">
              {isMobile ? 'Sign in to continue' : 'Sign in to access your library account'}
            </p>
          </div>
          
          {/* Error Toast */}
          {errors.submit && (
            <div className="error-toast" role="alert">
              <span className="error-icon">⚠️</span>
              <span className="error-message">{errors.submit}</span>
            </div>
          )}
          
          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <span className="label-icon">📧</span>
                Email Address
              </label>
              <div className="input-container">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  value={formData.email}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  required
                />
              </div>
              {errors.email && (
                <span className="field-error" role="alert">{errors.email}</span>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <span className="label-icon">🔒</span>
                Password
              </label>
              <div className="input-container">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  value={formData.password}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  required
                />
                <button 
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && (
                <span className="field-error" role="alert">{errors.password}</span>
              )}
            </div>
            
            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="checkbox-input"
                  disabled={isLoading}
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-text">Remember Me</span>
              </label>
              <button 
                type="button" 
                onClick={() => handleNavigation('forgot-password')} 
                className="forgot-link"
                disabled={isLoading}
              >
                Forgot Password?
              </button>
            </div>
            
            <button 
              type="submit" 
              className={`login-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner" aria-hidden="true"></span>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span className="btn-icon" aria-hidden="true">🚀</span>
                  <span>Sign In</span>
                </>
              )}
            </button>
            
            <div className="signup-link">
              <p>
                Don't have an account? 
                <button 
                  type="button" 
                  onClick={() => handleNavigation('register')} 
                  className="signup-text"
                  disabled={isLoading}
                >
                  Create Account
                </button>
              </p>
            </div>

            {/* Quick Demo Credentials for Testing */}
            {process.env.NODE_ENV === 'development' && (
              <div className="demo-credentials">
                <details className="demo-details">
                  <summary className="demo-summary">Demo Credentials</summary>
                  <div className="demo-content">
                    <p><strong>Admin:</strong> admin@library.com / admin123</p>
                    <p><strong>User:</strong> user@library.com / user123</p>
                  </div>
                </details>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;