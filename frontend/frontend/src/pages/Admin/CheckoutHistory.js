import React, { useState, useEffect } from 'react';
import api, { Api_Endpoints } from '../../service/api';
import './styles/CheckoutHistory.css';

const CheckoutHistory = ({ onNavigate, userRole = 'admin' }) => {
  const [checkouts, setCheckouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchAllCheckouts();
  }, []);

  const fetchAllCheckouts = async () => {
    try {
      setLoading(true);
      const response = await api.get(Api_Endpoints.CHECKOUT.ALL_HISTORY);
      console.log('All checkouts response:', response.data);
      
      // FIX: Handle both response formats
      const checkoutData = response.data.data || response.data.allrecords || [];
      setCheckouts(checkoutData);
      
    } catch (err) {
      setError('Failed to fetch checkout records');
      console.error('Error fetching checkouts:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (checkout) => {
    if (checkout.returnDate) {
      return (
        <span className="status-badge returned">
          <span className="status-dot"></span>
          Returned
        </span>
      );
    } else {
      return (
        <span className="status-badge active">
          <span className="status-dot"></span>
          Active
        </span>
      );
    }
  };

  const filteredCheckouts = checkouts.filter(checkout => {
    const matchesSearch = checkout.book?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         checkout.user?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && !checkout.returnDate) ||
                         (statusFilter === 'returned' && checkout.returnDate);
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="checkout-history-container">
        <div className="loading">Loading checkout history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="checkout-history-container">
        <div className="error-container">
          <h3>{error}</h3>
          <button onClick={() => onNavigate('books')} className="back-btn">
            Back to Books
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-history-container">
      <div className="checkout-history-content">
        <div className="page-header">
          <h1>All Checkout History</h1>
          <p>View and manage all book checkouts across the system. {userRole === 'admin' && '(Admin View)'}</p>
          <p>Total Records: {checkouts.length}</p>
        </div>

        <div className="filters-section">
          <div className="search-container">
            <span className="material-symbols-outlined search-icon"></span>
            <input
              type="text"
              placeholder="Search by book name or user..."
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
          </div>
        </div>

        <div className="table-container">
          <table className="checkout-table">
            <thead>
              <tr>
                <th>Book Name</th>
                <th>User</th>
                <th>Email</th>
                <th>Checkout Date</th>
                <th>Due Date</th>
                <th>Return Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredCheckouts.map(checkout => (
                <tr key={checkout._id}>
                  <td className="book-name">{checkout.book}</td>
                  <td className="user-name">{checkout.user}</td>
                  <td className="user-email">{checkout.email}</td>
                  <td className="checkout-date">{formatDate(checkout.checkoutDate)}</td>
                  <td className="due-date">{formatDate(checkout.dueDate)}</td>
                  <td className="return-date">
                    {checkout.returnDate ? formatDate(checkout.returnDate) : 'Not Returned'}
                  </td>
                  <td>{getStatusBadge(checkout)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCheckouts.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>No checkout records found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutHistory;