import React, { useState } from 'react';
import './CheckoutHistory.css';

const CheckoutHistory = ({ onNavigate, userRole = 'admin' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const checkouts = [
    {
      id: 1,
      bookName: "The Midnight Library",
      userName: "Alice Johnson",
      checkoutDate: "Oct 26, 2023",
      status: "returned"
    },
    {
      id: 2,
      bookName: "Project Hail Mary",
      userName: "Bob Smith",
      checkoutDate: "Oct 22, 2023",
      status: "active"
    },
    {
      id: 3,
      bookName: "Dune",
      userName: "Charlie Brown",
      checkoutDate: "Oct 15, 2023",
      status: "returned"
    },
    {
      id: 4,
      bookName: "Klara and the Sun",
      userName: "Diana Prince",
      checkoutDate: "Oct 14, 2023",
      status: "active"
    },
    {
      id: 5,
      bookName: "The Four Winds",
      userName: "Eve Adams",
      checkoutDate: "Sep 30, 2023",
      status: "returned"
    }
  ];

  const filteredCheckouts = checkouts.filter(checkout => {
    const matchesSearch = checkout.bookName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         checkout.userName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || checkout.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      returned: { label: 'Returned', color: '#10b981' },
      active: { label: 'Active', color: '#f59e0b' }
    };
    
    const config = statusConfig[status];
    return (
      <span className="status-badge" style={{ backgroundColor: `${config.color}20`, color: config.color }}>
        <span className="status-dot" style={{ backgroundColor: config.color }}></span>
        {config.label}
      </span>
    );
  };

  return (
    <div className="checkout-history-container">
      <div className="checkout-history-content">
        <div className="page-header">
          <h1>All Checkout History</h1>
          <p>View and manage all book checkouts across the system. {userRole === 'admin' && '(Admin View)'}</p>
        </div>

        <div className="filters-section">
          <div className="search-container">
            <span className="material-symbols-outlined search-icon">search</span>
            <input
              type="text"
              placeholder="Search by book name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-controls">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="status-filter"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="returned">Returned</option>
            </select>
            
            <button className="reset-filters">
              Reset Filters
            </button>
          </div>
        </div>

        <div className="table-container">
          <table className="checkout-table">
            <thead>
              <tr>
                <th>
                  <button className="sortable-header">
                    Book Name
                    <span className="material-symbols-outlined">swap_vert</span>
                  </button>
                </th>
                <th>User</th>
                <th>
                  <button className="sortable-header">
                    Checkout Date
                    <span className="material-symbols-outlined">swap_vert</span>
                  </button>
                </th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredCheckouts.map(checkout => (
                <tr key={checkout.id}>
                  <td className="book-name">{checkout.bookName}</td>
                  <td className="user-name">{checkout.userName}</td>
                  <td className="checkout-date">{checkout.checkoutDate}</td>
                  <td>{getStatusBadge(checkout.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination-section">
          <div className="pagination-info">
            Showing <strong>1</strong> to <strong>{filteredCheckouts.length}</strong> of <strong>97</strong> results
          </div>
          
          <div className="pagination-controls">
            <button className="pagination-btn">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            
            <button className="pagination-btn active">1</button>
            <button className="pagination-btn">2</button>
            <button className="pagination-btn">3</button>
            
            <span className="pagination-ellipsis">...</span>
            
            <button className="pagination-btn">10</button>
            
            <button className="pagination-btn">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutHistory;