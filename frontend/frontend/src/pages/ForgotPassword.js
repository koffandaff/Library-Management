import React, { useState } from 'react';
import './ForgotPassword.css';
import api, { Api_Endpoints } from '../service/api';

const ForgotPassword = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await api.post(Api_Endpoints.AUTH.FORGOT_PASSWORD, {
        email
      });

      const data = response.data;

      if (data.success) {
        setMessage(data.message);
        // Navigate to OTP verification page with email using onNavigate
        setTimeout(() => {
          onNavigate('verify-otp', { email: data.email || email });
        }, 2000);
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (err) {
      console.log('Forgot password error:', err);
      setError(err.response?.data?.message || 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="forgot-password-header">
          <div className="forgot-password-icon">🔑</div>
          <h1>Forgot Password</h1>
          <p>Enter your email to receive a verification OTP</p>
        </div>

        {message && (
          <div className="success-message">
            <span className="success-icon">✅</span>
            {message}
          </div>
        )}

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="forgot-password-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isLoading || !email}
          >
            {isLoading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>

        <div className="back-to-login">
          <button 
            type="button" 
            onClick={() => onNavigate('login')}
            className="back-link"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;