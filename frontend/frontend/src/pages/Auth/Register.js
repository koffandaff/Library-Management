import React, { useState } from 'react';
import './styles/Register.css';

const Register = ({ onRegister, onNavigate }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userRole, setUserRole] = useState('user');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminKey: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (userRole === 'admin' && !formData.adminKey.trim()) {
      newErrors.adminKey = 'Admin key is required for admin registration';
    } else if (userRole === 'admin' && formData.adminKey !== 'ADMIN123') {
      newErrors.adminKey = 'Invalid admin key';
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
      await onRegister(
        formData.fullName, 
        formData.email, 
        formData.password, 
        userRole, 
        formData.adminKey
      );
    } catch (err) {
      setErrors({ 
        submit: err.response?.data?.message || 'Registration failed. Please try again.' 
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

  const handleRoleChange = (role) => {
    setUserRole(role);
    // Clear admin key when switching to user role
    if (role === 'user') {
      setFormData(prev => ({ ...prev, adminKey: '' }));
      setErrors(prev => ({ ...prev, adminKey: '' }));
    }
  };

  const handleLoginRedirect = () => {
    if (onNavigate) {
      onNavigate('login');
    }
  };

  return (
    <div className="register-container">
      <div className="register-background">
        <div className="bg-blob bg-blob-1"></div>
        <div className="bg-blob bg-blob-2"></div>
      </div>
      
      <div className="register-card">
        <div className="register-content">
          <div className="register-header">
            <div className="register-icon">🌟</div>
            <h1 className="register-title">Join Our Library</h1>
            <p className="register-subtitle">Create your account to start exploring books</p>
          </div>

          {/* Error Toast */}
          {errors.submit && (
            <div className="error-toast">
              <span className="error-icon">⚠️</span>
              <span className="error-message">{errors.submit}</span>
            </div>
          )}
          
          <form className="register-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="fullName" className="form-label">
                <span className="label-icon">👤</span>
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="e.g., Jane Doe"
                className={`form-input ${errors.fullName ? 'error' : ''}`}
                value={formData.fullName}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
              {errors.fullName && <span className="field-error">{errors.fullName}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <span className="label-icon">📧</span>
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="e.g., jane.doe@example.com"
                className={`form-input ${errors.email ? 'error' : ''}`}
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">🎯</span>
                Account Type
              </label>
              <div className="role-selection">
                <label className={`role-option ${userRole === 'user' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={userRole === 'user'}
                    onChange={() => handleRoleChange('user')}
                    className="role-radio"
                    disabled={isLoading}
                  />
                  <span className="role-icon">👤</span>
                  <div className="role-info">
                    <span className="role-label">User</span>
                    <span className="role-description">Borrow & read books</span>
                  </div>
                </label>
                <label className={`role-option ${userRole === 'admin' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={userRole === 'admin'}
                    onChange={() => handleRoleChange('admin')}
                    className="role-radio"
                    disabled={isLoading}
                  />
                  <span className="role-icon">⚡</span>
                  <div className="role-info">
                    <span className="role-label">Admin</span>
                    <span className="role-description">Manage library</span>
                  </div>
                </label>
              </div>
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
                  placeholder="Create a strong password"
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
                <button 
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                <span className="label-icon">✅</span>
                Confirm Password
              </label>
              <div className="input-container">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
                <button 
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
            </div>

            {userRole === 'admin' && (
              <div className="form-group">
                <label htmlFor="adminKey" className="form-label">
                  <span className="label-icon">🔑</span>
                  Admin Key
                </label>
                <input
                  id="adminKey"
                  name="adminKey"
                  type="password"
                  placeholder="Enter admin key"
                  className={`form-input ${errors.adminKey ? 'error' : ''}`}
                  value={formData.adminKey}
                  onChange={handleInputChange}
                  required={userRole === 'admin'}
                  disabled={isLoading}
                />
                {errors.adminKey ? (
                  <span className="field-error">{errors.adminKey}</span>
                ) : (
                  <small className="admin-key-hint">Use "ADMIN123" as admin key for testing</small>
                )}
              </div>
            )}
            
            <button 
              type="submit" 
              className={`register-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Creating Account...
                </>
              ) : (
                <>
                  <span className="btn-icon">🚀</span>
                  Create Account
                </>
              )}
            </button>
          </form>
          
          <div className="login-redirect">
            <p>Already have an account?</p>
            <button 
              onClick={handleLoginRedirect} 
              className="login-link"
              disabled={isLoading}
            >
              Sign In Here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;