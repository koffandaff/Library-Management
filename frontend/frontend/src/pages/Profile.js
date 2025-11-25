import React, { useState, useEffect } from 'react';
import api, { Api_Endpoints } from '../service/api';
import './Profile.css';

const Profile = ({ onNavigate, isLoggedIn, userRole }) => {
  const [userData, setUserData] = useState(null);
  const [userStats, setUserStats] = useState({ booksCheckedOut: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserData();
    }
  }, [isLoggedIn]);

  const fetchUserData = async () => {
    try {
      const response = await api.get(Api_Endpoints.AUTH.CURRENT);
      setLoading(false);
      console.log('User data response:', response.data);
      
      // Fix: Properly set userData based on your API response structure
      if (response.data && response.data.user) {
        
        setUserData(response.data.user.user || response.data.user);
        console.log(userData)
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="not-logged-in">
        <h2>Please log in to view your profile</h2>
        <button onClick={() => onNavigate('login')}>Go to Login</button>
      </div>
    );
  }

  if (loading) return <div>Loading profile...</div>;
  if (!userData) return <div>No user data found</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="user-info">
          <h2>{userData.name}</h2>
          <p>{userData.email}</p>
        </div>
        <div className="stats">
          <div className="stat">
            <span className="stat-number">{userStats.booksCheckedOut}</span>
            <span className="stat-label">Books Checked Out</span>
          </div>
          <div className="stat">
            <span className={`role-badge ${userData.role}`}>
              {userData.role}
            </span>
            <span className="stat-label">Role</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;