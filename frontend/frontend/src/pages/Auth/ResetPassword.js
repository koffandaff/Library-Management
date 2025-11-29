import React, { useState, useEffect } from 'react';
import './styles/ResetPassword.css';
import api, { Api_Endpoints } from '../../service/api';

const ResetPassword = ({ onNavigate, pageParams }) => {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(3);
  
  const email = pageParams?.email || '';
  const otp = pageParams?.otp || '';

  // Password strength checker
  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  useEffect(() => {
    setPasswordStrength(checkPasswordStrength(formData.newPassword));
  }, [formData.newPassword]);

  // Auto-redirect timer
  useEffect(() => {
    if (message && timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else if (message && timer === 0) {
      onNavigate('login');
    }
  }, [message, timer, onNavigate]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const validateForm = () => {
    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (passwordStrength < 50) {
      setError('Please choose a stronger password');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await api.post(Api_Endpoints.AUTH.RESET_PASSWORD, {
        email, 
        otp,
        newPassword: formData.newPassword
      });

      const data = response.data;

      if (data.success) {
        setMessage('Password reset successfully! Redirecting to login...');
        setFormData({ newPassword: '', confirmPassword: '' });
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      console.error('Reset password error:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          'Network error. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthText = () => {
    if (formData.newPassword.length === 0) return '';
    if (passwordStrength <= 25) return 'Weak';
    if (passwordStrength <= 50) return 'Fair';
    if (passwordStrength <= 75) return 'Good';
    return 'Strong';
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 25) return '#ef4444';
    if (passwordStrength <= 50) return '#f59e0b';
    if (passwordStrength <= 75) return '#3b82f6';
    return '#10b981';
  };

  return (
    <div className="reset-password-container">
      {/* Background Animation */}
      <div className="reset-password-background">
        <div className="bg-blob bg-blob-1"></div>
        <div className="bg-blob bg-blob-2"></div>
      </div>

      <div className="reset-password-card">
        <div className="reset-password-header">
          <div className="reset-password-icon">🔒</div>
          <h1>Create New Password</h1>
          <p>Your new password must be different from previously used passwords</p>
        </div>

        {/* Success Message */}
        {message && (
          <div className="success-message">
            <span className="success-icon">✅</span>
            <div className="message-content">
              <p>{message}</p>
              <small>Redirecting in {timer} seconds...</small>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="reset-password-form">
          {/* New Password Field */}
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                value={formData.newPassword}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                placeholder="Enter new password"
                required
                disabled={isLoading}
                minLength="6"
                className="password-input"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            {formData.newPassword && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div 
                    className="strength-fill"
                    style={{
                      width: `${passwordStrength}%`,
                      backgroundColor: getPasswordStrengthColor()
                    }}
                  ></div>
                </div>
                <span 
                  className="strength-text"
                  style={{ color: getPasswordStrengthColor() }}
                >
                  {getPasswordStrengthText()}
                </span>
              </div>
            )}

            {/* Password Requirements */}
            <div className="password-requirements">
              <p className="requirements-title">Password must contain:</p>
              <ul className="requirements-list">
                <li className={formData.newPassword.length >= 6 ? 'met' : ''}>
                  At least 6 characters
                </li>
                <li className={/[A-Z]/.test(formData.newPassword) ? 'met' : ''}>
                  One uppercase letter
                </li>
                <li className={/[0-9]/.test(formData.newPassword) ? 'met' : ''}>
                  One number
                </li>
                <li className={/[^A-Za-z0-9]/.test(formData.newPassword) ? 'met' : ''}>
                  One special character
                </li>
              </ul>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="Confirm new password"
              required
              disabled={isLoading}
              minLength="6"
            />
            {formData.confirmPassword && formData.newPassword === formData.confirmPassword && (
              <div className="password-match">✓ Passwords match</div>
            )}
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isLoading || !formData.newPassword || !formData.confirmPassword}
          >
            {isLoading ? (
              <>
                <div className="btn-spinner"></div>
                Resetting Password...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>

        <div className="back-links">
          <button 
            type="button" 
            onClick={() => onNavigate('verify-otp', { email })}
            className="back-link"
            disabled={isLoading}
          >
            ← Back to Verification
          </button>
          <button 
            type="button" 
            onClick={() => onNavigate('login')}
            className="back-link"
            disabled={isLoading}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;