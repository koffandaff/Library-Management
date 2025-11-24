import React from 'react';
import './BookDetails.css';

const BookDetails = ({ onNavigate, isAdmin = false }) => {
  const book = {
    id: 1,
    title: "The Midnight Library",
    author: "Matt Haig",
    description: "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. To see how things would be if you had made other choices... Would you have done anything different, if you had the chance to undo your regrets? A dazzling novel about all the choices that go into a life well lived.",
    category: "Fantasy Fiction",
    publisher: "Viking Press",
    isbn: "978-0525559474",
    availability: "Available",
    cover: "https://lh3.googleusercontent.com/aida-public/AB6AXuALinY36A_9qOAL9GAl0rCN8EniMdWxwqEZKPDE1CjhQSi3RL7kptHByPVKD0nHn7VbS2q4cok8ouitP-BARn9xlIom58u6x5HxrClBDddVHnVfkv1e9ISs3Y2JYqdtVJavLPo_kPmhFFycAReZrA1wQmNbCtO8MRvnYcdK56dyJfEtJgv9G-K1Cnj778Ar7UBefWxbCkEFwnKd6wMD_OSUFZfLwxCHYNmGbfHAnG4HtLc5DU0eP49C6yDkE5l4V0_Nj7GS4BpBbIc"
  };

  const handleBackToLibrary = () => {
    if (onNavigate) {
      onNavigate('books');
    }
  };

  const handleCheckout = () => {
    console.log('Checking out book:', book.id);
    // In real app, you'd make API call here
  };

  const handleUpdateDetails = () => {
    if (onNavigate) {
      onNavigate('update-book', { bookId: book.id });
    }
  };

  const handleDeleteBook = () => {
    if (window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
      console.log('Deleting book:', book.id);
      handleBackToLibrary();
    }
  };

  return (
    <div className="book-details-container">
      <div className="book-details-content">
        <div className="breadcrumbs">
          <button className="breadcrumb-link" onClick={handleBackToLibrary}>Home</button>
          <span className="breadcrumb-separator">/</span>
          <button className="breadcrumb-link" onClick={handleBackToLibrary}>Library</button>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{book.title}</span>
        </div>

        <div className="book-details-main">
          <div className="book-cover-section">
            <div 
              className="book-cover"
              style={{ backgroundImage: `url(${book.cover})` }}
            ></div>
          </div>

          <div className="book-info-section">
            <div className="book-header">
              <h1 className="book-title">{book.title}</h1>
              <p className="book-author">by {book.author}</p>
            </div>

            <p className="book-description">{book.description}</p>

            <div className="book-details-card">
              <h3 className="details-title">Book Details</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Category</span>
                  <span className="detail-value">{book.category}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Publisher</span>
                  <span className="detail-value">{book.publisher}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">ISBN</span>
                  <span className="detail-value">{book.isbn}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Availability</span>
                  <span className={`availability-status ${book.availability.toLowerCase()}`}>
                    {book.availability}
                  </span>
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <button className="action-btn checkout-btn" onClick={handleCheckout}>
                Checkout Book
              </button>
              {isAdmin && (
                <>
                  <button className="action-btn update-btn" onClick={handleUpdateDetails}>
                    Update Details
                  </button>
                  <button className="action-btn delete-btn" onClick={handleDeleteBook}>
                    Delete Book
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;