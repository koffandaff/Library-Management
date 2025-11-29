import React, { useState, useEffect } from 'react';
import api, { Api_Endpoints } from '../../service/api';
import './styles/BookDetails.css';

const BookDetails = ({ onNavigate, isAdmin = false, bookId }) => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (bookId) {
      fetchBookDetails();
    }
  }, [bookId]);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      console.log("BookId is:: ", bookId);
      const response = await api.get(`${Api_Endpoints.BOOKS.GET_BOOK_DETAILS}/${bookId}`);
      console.log("Book details response:", response.data);
      setBook(response.data);
      setBook(response.data.Book)
    } catch (err) {
      setError('Failed to fetch book details');
      console.error('Error fetching book:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLibrary = () => {
    if (onNavigate) {
      onNavigate('books');
    }
  };

  const handleCheckout = async () => {
    try {
      if (!book || book.copies < 1) {
        alert('No copies available for checkout');
        return;
      }

      // Use bookid (like 1001) for checkout, not MongoDB _id
      await api.post(`${Api_Endpoints.CHECKOUT.CHECKOUT_BOOK}/${book.bookid}`, {
        copies: 1
      });
      
      alert('Book checked out successfully!');
      fetchBookDetails(); // Refresh book details to show updated copies
    } catch (err) {
      console.error('Error checking out book:', err);
      const errorMessage = err.response?.data?.message || 'Failed to checkout book';
      alert(errorMessage);
    }
  };

  const handleUpdateDetails = () => {
    if (onNavigate && book) {
      onNavigate('edit-book', { bookId: book._id });
    }
  };

  const handleDeleteBook = async () => {
    if (window.confirm(`Are you sure you want to delete "${book.name}"?`)) {
      try {
        await api.delete(`${Api_Endpoints.BOOKS.DELETE_BOOK}/${book._id}`);
        alert('Book deleted successfully!');
        handleBackToLibrary();
      } catch (err) {
        console.error('Error deleting book:', err);
        alert('Failed to delete book');
      }
    }
  };

  if (loading) {
    return (
      <div className="book-details-container">
        <div className="loading-container">
          <div className="loading-spinner">📖</div>
          <p>Loading book details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="book-details-container">
        <div className="error-container">
          <div className="error-icon">❌</div>
          <h3>{error}</h3>
          <button onClick={handleBackToLibrary} className="back-btn">
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="book-details-container">
        <div className="error-container">
          <h3>Book not found</h3>
          <button onClick={handleBackToLibrary} className="back-btn">
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="book-details-container">
      <div className="book-details-content">
        <div className="breadcrumbs">
          <button className="breadcrumb-link" onClick={handleBackToLibrary}>Home</button>
          <span className="breadcrumb-separator">/</span>
          <button className="breadcrumb-link" onClick={handleBackToLibrary}>Library</button>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{book.name}</span>
        </div>

        <div className="book-details-main">
          <div className="book-cover-section">
            <div className="book-cover-placeholder">
              <span className="book-emoji">📖</span>
            </div>
          </div>

          <div className="book-info-section">
            <div className="book-header">
              <h1 className="book-title">{book.name}</h1>
              <p className="book-author">by {book.authorname}</p>
            </div>

            <p className="book-description">
              {book.description || `A ${book.category} book by ${book.authorname}.`}
            </p>

            <div className="book-details-card">
              <h3 className="details-title">Book Details</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Category</span>
                  <span className="detail-value">{book.category}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Book ID</span>
                  <span className="detail-value">{book.bookid}</span>
                </div>
                <div className="detail-item full-width">
                  <span className="detail-label">Description</span>
                  <span className="detail-value description-text">
                    {book.description || 'No description available'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Copies Available</span>
                  <span className="detail-value">{book.copies}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Status</span>
                  <span className={`availability-status ${book.copies > 0 ? 'available' : 'unavailable'}`}>
                    {book.copies > 0 ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <button 
                className={`action-btn checkout-btn ${book.copies === 0 ? 'disabled' : ''}`}
                onClick={handleCheckout}
                disabled={book.copies === 0}
              >
                {book.copies > 0 ? `Checkout Book (${book.copies} available)` : 'Not Available'}
              </button>
              {isAdmin && (
                <div className="admin-actions">
                  <button className="action-btn update-btn" onClick={handleUpdateDetails}>
                    Update Details
                  </button>
                  <button className="action-btn delete-btn" onClick={handleDeleteBook}>
                    Delete Book
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;