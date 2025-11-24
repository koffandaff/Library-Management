import React from 'react';
import './AdminDashboard.css';

const AdminDashboard = ({ onNavigate }) => {
  const stats = [
    { label: 'Total Users', value: '1,482', icon: 'group' },
    { label: 'Total Authors', value: '256', icon: 'edit' },
    { label: 'Total Books', value: '8,921', icon: 'book' },
    { label: 'Active Checkouts', value: '112', icon: 'sync_alt' }
  ];

  const menuItems = [
    { label: 'Dashboard', icon: 'dashboard', active: true },
    { label: 'Manage Users', icon: 'group' },
    { label: 'Manage Authors', icon: 'edit' },
    { label: 'Manage Books', icon: 'book' },
    { label: 'Manage Checkouts', icon: 'sync_alt' }
  ];

  const handleMenuClick = (menuItem) => {
    if (onNavigate) {
      const routeMap = {
        'Manage Users': 'users',
        'Manage Authors': 'authors',
        'Manage Books': 'books',
        'Manage Checkouts': 'checkout-history'
      };
      onNavigate(routeMap[menuItem] || 'admin-dashboard');
    }
  };

  const handleAddBook = () => {
    if (onNavigate) {
      onNavigate('add-book');
    }
  };

  const handleLogout = () => {
    if (onNavigate) {
      onNavigate('home');
    }
  };

  return (
    <div className="admin-dashboard-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="admin-logo"></div>
          <div className="admin-info">
            <h1>Admin Panel</h1>
            <p>Library System</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.label}
              className={`nav-item ${item.active ? 'active' : ''}`}
              onClick={() => handleMenuClick(item.label)}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="material-symbols-outlined">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-content">
          <div className="page-header">
            <h1>Dashboard</h1>
            <button className="add-book-btn" onClick={handleAddBook}>
              <span className="material-symbols-outlined">add</span>
              <span>Add Book</span>
            </button>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-card">
                <div className="stat-icon">
                  <span className="material-symbols-outlined">{stat.icon}</span>
                </div>
                <div className="stat-content">
                  <h3 className="stat-value">{stat.value}</h3>
                  <p className="stat-label">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="action-buttons">
              <button className="action-btn" onClick={() => handleMenuClick('Manage Books')}>
                <span className="material-symbols-outlined">book</span>
                <span>Manage Books</span>
              </button>
              <button className="action-btn" onClick={() => handleMenuClick('Manage Users')}>
                <span className="material-symbols-outlined">group</span>
                <span>Manage Users</span>
              </button>
              <button className="action-btn" onClick={() => handleMenuClick('Manage Checkouts')}>
                <span className="material-symbols-outlined">sync_alt</span>
                <span>View Checkouts</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;