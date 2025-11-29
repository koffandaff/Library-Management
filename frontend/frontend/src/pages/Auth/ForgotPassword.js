import React, { useState, useEffect } from 'react';
import './styles/ForgotPassword.css';
import api, { Api_Endpoints } from '../../service/api';

const ForgotPassword = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  // Clear messages when email changes
  useEffect(() => {
    if (message || error) {
      setMessage('');
      setError('');
    }
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');
    setTouched(true);

    // Basic email validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post(Api_Endpoints.AUTH.FORGOT_PASSWORD, {
        email: email.trim().toLowerCase()
      });

      const data = response.data;

      if (data.success) {
        setMessage(data.message || 'OTP sent successfully! Redirecting...');
        
        // Navigate to OTP verification page with email
        setTimeout(() => {
          onNavigate('verify-otp', { 
            email: data.email || email,
            source: 'forgot-password'
          });
        }, 2000);
      } else {
        setError(data.message || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error ||
                          'Network error. Please check your connection and try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    if (!touched) setTouched(true);
  };

  const handleBackToLogin = () => {
    onNavigate('login');
  };

  const isFormValid = email && /\S+@\S+\.\S+/.test(email);

  return (
    <div className="forgot-password-container">
      {/* Animated Background */}
      <div className="forgot-password-background">
        <div className="bg-blob bg-blob-1"></div>
        <div className="bg-blob bg-blob-2"></div>
      </div>

      {/* Main Card */}
      <div className="forgot-password-card">
        {/* Header */}
        <div className="forgot-password-header">
          <div className="forgot-password-icon">🔑</div>
          <h1>Reset Your Password</h1>
          <p>
            Enter your email address and we'll send you a verification code 
            to reset your password.
          </p>
        </div>

        {/* Messages */}
        <div className="message-container">
          {message && (
            <div className="success-message">
              <span className="message-icon">✅</span>
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className="error-message">
              <span className="message-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {!message && !error && (
            <div className="info-message">
              <span className="message-icon">💡</span>
              <span>
                Make sure to enter the email address associated with your account.
              </span>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="forgot-password-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleInputChange}
              placeholder="Enter your email address"
              required
              disabled={isLoading}
              autoComplete="email"
              autoFocus
            />
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isLoading || !isFormValid}
          >
            {isLoading ? (
              <>
                <div className="loading-spinner"></div>
                Sending OTP...
              </>
            ) : (
              'Send Verification Code'
            )}
          </button>
        </form>

        {/* Back to Login */}
        <div className="back-to-login">
          <button 
            type="button" 
            onClick={handleBackToLogin}
            className="back-link"
            disabled={isLoading}
          >
            <span>←</span>
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;