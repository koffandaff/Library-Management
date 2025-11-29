import React, { useState, useEffect } from 'react';
import api, { Api_Endpoints } from '../../service/api';
import './styles/PersonalCheckoutHistory.css';

const PersonalCheckoutHistory = ({ onNavigate }) => {
  const [checkouts, setCheckouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCheckoutHistory();
  }, []);

  const fetchCheckoutHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(Api_Endpoints.CHECKOUT.PERSONAL_HISTORY);
      console.log('Checkout history response:', response.data);
      
      // Handle both response formats for backward compatibility
      const checkoutData = response.data.data || response.data.message || [];
      setCheckouts(checkoutData);
      
    } catch (err) {
      console.error('Error fetching checkout history:', err);
      const errorMessage = err.response?.data?.message || 'Failed to fetch checkout history';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleReturnBook = async (checkoutId) => {
    try {
      await api.put(`${Api_Endpoints.CHECKOUT.RETURN_BOOK}/${checkoutId}`);
      alert('Book returned successfully!');
      fetchCheckoutHistory(); // Refresh the list
    } catch (err) {
      console.error('Error returning book:', err);
      const errorMessage = err.response?.data?.message || 'Failed to return book';
      alert(errorMessage);
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

  if (loading) {
    return (
      <div className="personal-checkout-container">
        <div className="loading">Loading your checkout history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="personal-checkout-container">
        <div className="error-container">
          <h3>Error Loading Checkout History</h3>
          <p>{error}</p>
          <button onClick={fetchCheckoutHistory} className="retry-btn">
            Try Again
          </button>
          <button onClick={() => onNavigate('books')} className="back-btn">
            Browse Books
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="personal-checkout-container">
      <div className="checkout-content">
        <div className="page-header">
          <h1>My Checkout History</h1>
          <p>A record of all the books you've checked out from the library.</p>
        </div>

        {checkouts.length > 0 ? (
          <div className="checkout-table-container">
            <table className="checkout-table">
              <thead>
                <tr>
                  <th>Book Title</th>
                  <th>Checkout Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {checkouts.map((checkout) => (
                  <tr key={checkout._id}>
                    <td className="book-title">{checkout.book}</td>
                    <td className="checkout-date">
                      {formatDate(checkout.checkoutDate)}
                    </td>
                    <td className="due-date">
                      {formatDate(checkout.dueDate)}
                    </td>
                    <td>{getStatusBadge(checkout)}</td>
                    <td className="actions">
                      {!checkout.returnDate && (
                        <button
                          className="return-btn"
                          onClick={() => handleReturnBook(checkout._id)}
                        >
                          Return Book
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <span className="material-symbols-outlined">menu_book</span>
            </div>
            <h3>No Checkout History</h3>
            <p>You haven't checked out any books yet. Start exploring our collection to find your next great read.</p>
            <button className="browse-books-btn" onClick={() => onNavigate('books')}>
              Browse Books
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalCheckoutHistory;