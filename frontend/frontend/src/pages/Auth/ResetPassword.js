import React, { useState } from 'react';
import './styles/ResetPassword.css';
import api, { Api_Endpoints } from '../../service/api';

const ResetPassword = ({ onNavigate, pageParams }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const email = pageParams?.email || '';
  const otp = pageParams?.otp || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await api.post(Api_Endpoints.AUTH.RESET_PASSWORD, {
        email, 
        otp,
        newPassword 
      });

      const data = response.data;

      if (data.success) {
        setMessage(data.message);
        setNewPassword('');
        setConfirmPassword('');
        
        // Redirect to login after success using onNavigate
        setTimeout(() => {
          onNavigate('login');
        }, 3000);
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (err) {
      console.log('Reset password error:', err);
      setError(err.response?.data?.message || 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <div className="reset-password-header">
          <div className="reset-password-icon">🔄</div>
          <h1>Reset Password</h1>
          <p>Enter your new password below</p>
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

        <form onSubmit={handleSubmit} className="reset-password-form">
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password (min 6 characters)"
              required
              disabled={isLoading}
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              disabled={isLoading}
              minLength="6"
            />
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isLoading || !newPassword || !confirmPassword}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div className="back-links">
          <button 
            type="button" 
            onClick={() => onNavigate('verify-otp', { email })}
            className="back-link"
          >
            ← Back
          </button>
          <button 
            type="button" 
            onClick={() => onNavigate('login')}
            className="back-link"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;