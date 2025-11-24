import React, { useState } from 'react';
import './Register.css';

const Register = ({ onRegister, onNavigate }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userRole, setUserRole] = useState('user');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminKey: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(userRole)
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    // Validate admin key if admin role selected
    // if (formData.role === 'admin' && formData.adminKey !== 'ADMIN123') {
    //   alert('Invalid admin key!');
    //   return;
    // }
    
    console.log('Registration attempt:', { ...formData, userRole });
    
    if (onRegister) {
      await onRegister(formData.fullName, formData.email, formData.confirmPassword, userRole, formData.adminKey)
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (role) => {
    setUserRole(role);
    // Clear admin key when switching to user role
    if (role === 'user') {
      setFormData(prev => ({ ...prev, adminKey: '' }));
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
            <h1 className="register-title">Create an Account</h1>
            <p className="register-subtitle">Join our library to manage and borrow books.</p>
          </div>
          
          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fullName" className="form-label">Full Name</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="e.g., Jane Doe"
                className="form-input"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="e.g., jane.doe@example.com"
                className="form-input"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Choose Role</label>
              <div className="role-selection">
                <label className="role-option">
                  <input
                    type="radio"
                    name="role"
                    value='admin'
                    checked={userRole === 'user'}
                    onChange={handleInputChange}
                    className="role-radio"
                  />
                  <span className="role-label">User</span>
                </label>
                <label className="role-option">
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={userRole === 'admin'}
                    onChange={() => handleRoleChange('admin')}
                    className="role-radio"
                  />
                  <span className="role-label">Admin</span>
                </label>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="input-container">
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

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <div className="input-container">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="form-input"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
                <button 
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <span className="material-symbols-outlined">
                    {showConfirmPassword ? "don't show" : "show"}
                  </span>
                </button>
              </div>
            </div>

            {userRole === 'admin' && (
              <div className="form-group">
                <label htmlFor="adminKey" className="form-label">Admin Key</label>
                <input
                  id="adminKey"
                  name="adminKey"
                  type="password"
                  placeholder="Enter admin key"
                  className="form-input"
                  value={formData.adminKey}
                  onChange={handleInputChange}
                  required
                />
                <small className="admin-key-hint">Use "ADMIN123" as admin key for testing</small>
              </div>
            )}
            
            <button type="submit" className="register-button">
              Create Account
            </button>
          </form>
          
          <div className="login-redirect">
            <p>Already have an account? 
              <button onClick={handleLoginRedirect} className="login-link">
                Log in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;