import React, { useState, useEffect } from 'react';
import api , { Api_Endpoints} from '../service/api';
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
      setLoading(false)
      console.log(response.data)
      console.log(response.data.user.user)
      // setUserData(response.data.user.user.name);
      const userDatag = response.data.user.user
      console.log("Userdataggggggggg", userDatag)
      console.log(userDatag.name)
      
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await api.get();
      const activeCheckouts = response.data.filter(checkout => checkout.status === 'active').length;
      setUserStats({ booksCheckedOut: activeCheckouts });
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    } finally {
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

  console.log("KIKIKIK", userDatag)

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="user-info">
          <h2>{userDatag.name}</h2>
          <p>{userDatag.email}</p>
        </div>
        <div className="stats">
          <div className="stat">
            <span className="stat-number">{userStats.booksCheckedOut}</span>
            <span className="stat-label">Books Checked Out</span>
          </div>
          <div className="stat">
            <span className={`role-badge ${userRole}`}>
              {userDatag.role}
            </span>
            <span className="stat-label">Role</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;