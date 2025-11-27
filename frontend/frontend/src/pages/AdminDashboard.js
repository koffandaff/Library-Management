import React, { useState, useEffect } from 'react';
import api, { Api_Endpoints } from '../service/api';
import './AdminDashboard.css';

const AdminDashboard = ({ onNavigate }) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAuthors: 0,
    totalBooks: 0,
    activeCheckouts: 0,
    totalCheckouts: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [booksResponse, checkoutsResponse, usersResponse] = await Promise.all([
        api.get(Api_Endpoints.BOOKS.GET_ALLBOOKS),
        api.get(Api_Endpoints.CHECKOUT.ALL_HISTORY),
        api.get(Api_Endpoints.USER.GET_ALL) // Get actual users count
      ]);

      const books = booksResponse.data || [];
      
      // FIX: Handle both response formats for checkouts
      const allCheckouts = checkoutsResponse.data?.data || checkoutsResponse.data?.allrecords || [];
      const activeCheckouts = allCheckouts.filter(checkout => !checkout.returnDate);

      // FIX: Get actual users count from users API
      const allUsers = usersResponse.data?.users || [];
      
      console.log('Dashboard data:', {
        books: books.length,
        checkouts: allCheckouts.length,
        users: allUsers.length,
        activeCheckouts: activeCheckouts.length
      });

      setStats({
        totalBooks: books.length,
        totalAuthors: new Set(books.map(book => book.authorname).filter(Boolean)).size,
        activeCheckouts: activeCheckouts.length,
        totalCheckouts: allCheckouts.length,
        totalUsers: allUsers.length // Use actual users count
      });

      // Get recent checkouts for activity feed
      const recentCheckouts = allCheckouts
        .sort((a, b) => new Date(b.checkoutDate) - new Date(a.checkoutDate))
        .slice(0, 5);
      
      setRecentActivity(recentCheckouts);

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // ... rest of your AdminDashboard component remains the same
  const handleMenuClick = (route) => {
    if (onNavigate && route) {
      onNavigate(route);
    }
  };

  const handleAddBook = () => {
    if (onNavigate) {
      onNavigate('add-book');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="admin-dashboard-container">
        <div className="loading-state">
          <div className="loading-spinner">📊</div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      <div className="admin-content">
        {/* Breadcrumbs */}
        <div className="breadcrumbs">
          <button className="breadcrumb-link" onClick={() => onNavigate('home')}>Home</button>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Admin Dashboard</span>
        </div>

        <div className="page-header">
          <div className="header-content">
            <h1>Admin Dashboard</h1>
            
            
          </div>
          
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <span className="icon">📚</span>
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.totalBooks}</h3>
              <p className="stat-label">Total Books</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <span className="icon">✍️</span>
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.totalAuthors}</h3>
              <p className="stat-label">Total Authors</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <span className="icon">👥</span>
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.totalUsers}</h3>
              <p className="stat-label">Total Users</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <span className="icon">📖</span>
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.activeCheckouts}</h3>
              <p className="stat-label">Active Checkouts</p>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          {/* Quick Actions */}
          <div className="dashboard-card quick-actions-card">
            <div className="card-header">
              <h2>Quick Actions</h2>
            </div>
            <div className="action-buttons">
              <button 
                className="action-btn" 
                onClick={() => handleMenuClick('books')}
              >
                <span className="btn-icon">📚</span>
                <span>Manage Books</span>
              </button>
              <button 
                className="action-btn" 
                onClick={() => handleMenuClick('authors')}
              >
                <span className="btn-icon">✍️</span>
                <span>Manage Authors</span>
              </button>
              <button 
                className="action-btn" 
                onClick={() => handleMenuClick('checkout-history')}
              >
                <span className="btn-icon">📖</span>
                <span>View Checkouts</span>
              </button>
              <button 
                className="action-btn" 
                onClick={handleAddBook}
              >
                <span className="btn-icon">➕</span>
                <span>Add New Book</span>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="dashboard-card activity-card">
            <div className="card-header">
              <h2>Recent Activity</h2>
            </div>
            <div className="activity-list">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-icon">
                      {activity.returnDate ? '↩️' : '📖'}
                    </div>
                    <div className="activity-content">
                      <p className="activity-text">
                        <strong>{activity.user}</strong> {activity.returnDate ? 'returned' : 'checked out'} "{activity.book}"
                      </p>
                      <span className="activity-time">
                        {formatDate(activity.returnDate || activity.checkoutDate)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-activity">
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* System Overview */}
        <div className="dashboard-card system-overview">
          <div className="card-header">
            <h2>System Overview</h2>
          </div>
          <div className="overview-stats">
            <div className="overview-item">
              <span className="overview-label">Total Checkouts</span>
              <span className="overview-value">{stats.totalCheckouts}</span>
            </div>
            <div className="overview-item">
              <span className="overview-label">Active Checkouts</span>
              <span className="overview-value">{stats.activeCheckouts}</span>
            </div>
            <div className="overview-item">
              <span className="overview-label">Return Rate</span>
              <span className="overview-value">
                {stats.totalCheckouts > 0 
                  ? `${Math.round(((stats.totalCheckouts - stats.activeCheckouts) / stats.totalCheckouts) * 100)}%`
                  : '0%'
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;