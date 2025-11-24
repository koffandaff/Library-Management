import React from 'react';
import './Profile.css';

const Profile = ({ onNavigate, isLoggedIn, userRole = 'admin' }) => {
  const user = {
    name: "Alex Doe",
    email: "alex.doe@library.com",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZL9DQMHw5qHHnNj_jqq0sLZlhP3AdPaAi69K9lfTpVXJqFYPwdb6OfMIWKffhXAqyIcFlTAKGBSCkJslTrlDcXkyyg_GKdwd5KXbmXsK0ZjYcejxDqahkDwGreuXQKyIXMfETSk4fMwfiBBlxvXCU6fWeVBnSHg7uPca6PwIJ1hS637in_B3gukyRm-oGnImSRQqxdbn0iS4oasxSiJbCsTsHi5C8Ohs37PbLk4J0PI08arKksH0hLy_5HrCRaqh_xElbqH8yOTE",
    booksCheckedOut: 7,
    role: userRole
  };

  const handleAdminDashboard = () => {
    if (onNavigate) {
      onNavigate('admin-dashboard');
    }
  };

  const handleLogout = () => {
    if (onNavigate) {
      onNavigate('home');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="profile-container">
        <div className="not-logged-in">
          <h2>Please log in to view your profile</h2>
          <button onClick={() => onNavigate('login')} className="login-btn">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-header">
          <h1>Your Profile</h1>
        </div>

        <div className="profile-card">
          <div className="profile-info">
            <div className="avatar-section">
              <div 
                className="user-avatar"
                style={{ backgroundImage: `url(${user.avatar})` }}
              ></div>
              <div className="user-details">
                <h2 className="user-name">{user.name}</h2>
                <p className="user-email">{user.email}</p>
              </div>
            </div>

            <div className="stats-section">
              <div className="stat-card">
                <span className="stat-number">{user.booksCheckedOut}</span>
                <span className="stat-label">Books Checked Out</span>
              </div>
              
              <div className="stat-card">
                <span className={`role-badge ${user.role}`}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
                <span className="stat-label">Role</span>
              </div>
            </div>

            <div className="actions-section">
              {user.role === 'admin' && (
                <button className="admin-dashboard-btn" onClick={handleAdminDashboard}>
                  Admin Dashboard
                </button>
              )}
              
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;