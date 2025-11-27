import React, { useState, useEffect } from 'react';
import api from '../service/api';
import './AuthorDetails.css';

const AuthorDetails = ({ onNavigate, isAdmin = false, authorId }) => {
  const [author, setAuthor] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authorId) {
      fetchAuthorDetails();
    }
  }, [authorId]);

  useEffect(() => {
    if (author) {
      fetchAuthorBooks();
    }
  }, [author]);

  const fetchAuthorDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/author/${authorId}`);
      setAuthor(response.data);
    } catch (err) {
      setError('Failed to fetch author details');
      console.error('Error fetching author:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuthorBooks = async () => {
    try {
      // Get all books and filter by author name
      const response = await api.get('/book');
      const allBooks = response.data;
      const authorBooks = allBooks.filter(book => 
        book.authorname === author.name
      );
      setBooks(authorBooks);
    } catch (err) {
      console.error('Error fetching books:', err);
      setBooks([]);
    }
  };

  const handleBackToAuthors = () => {
    if (onNavigate) {
      onNavigate('authors');
    }
  };

  const handleBookClick = (bookId) => {
    if (onNavigate) {
      onNavigate('book-details', { bookId });
    }
  };

  const handleUpdateAuthor = () => {
    if (onNavigate) {
      onNavigate('author-update', { authorId });
    }
  };

  const handleDeleteAuthor = () => {
    if (onNavigate) {
      onNavigate('author-delete', { authorId });
    }
  };

  // Cool author icon
  const getAuthorIcon = (name) => {
    const icons = ['📚', '✍️', '📖', '🖋️', '📝', '🎨', '🌟', '💫', '🔥', '⭐'];
    const index = name.charCodeAt(0) % icons.length;
    return icons[index];
  };

  if (loading) {
    return (
      <div className="author-details-container">
        <div className="loading">
          <div className="loading-icon">📚</div>
          <p>Loading author details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="author-details-container">
        <div className="error">
          <div className="error-icon">❌</div>
          <h3>{error}</h3>
          <button onClick={handleBackToAuthors} className="back-btn">
            Back to Authors
          </button>
        </div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="author-details-container">
        <div className="error">
          <div className="error-icon">❓</div>
          <h3>Author not found</h3>
          <button onClick={handleBackToAuthors} className="back-btn">
            Back to Authors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="author-details-container">
      <div className="author-details-content">
        <div className="author-details-header">
          <button className="back-button" onClick={handleBackToAuthors}>
            <span className="back-icon">←</span>
            Back to Authors
          </button>
        </div>

        <div className="author-main-section">
          <div className="author-info-card">
            <div className="author-header">
              <div className="author-avatar-large">
                <span className="author-icon-large">
                  {getAuthorIcon(author.name)}
                </span>
              </div>
              <div className="author-title">
                <h1 className="author-name">{author.name}</h1>
                <div className="author-stats">
                  <span className="books-count">
                    {books.length} {books.length === 1 ? 'Book' : 'Books'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="author-bio-section">
              <h3 className="section-title">Biography</h3>
              <p className="author-biography">
                {author.bio || 'No biography available for this author.'}
              </p>
            </div>
            
            {isAdmin && (
              <div className="admin-actions">
                <button className="update-author-btn" onClick={handleUpdateAuthor}>
                  <span className="btn-icon">✏️</span>
                  Update Author
                </button>
                <button className="delete-author-btn" onClick={handleDeleteAuthor}>
                  <span className="btn-icon">🗑️</span>
                  Delete Author
                </button>
              </div>
            )}
          </div>

          <div className="author-books-card">
            <h2 className="books-section-title">
              Books by {author.name}
              <span className="books-count-badge">{books.length}</span>
            </h2>
            
            <div className="books-list">
              {books.length > 0 ? (
                books.map(book => (
                  <div 
                    key={book._id} 
                    className="book-item"
                    onClick={() => handleBookClick(book._id)}
                  >
                    <div className="book-icon">📖</div>
                    <div className="book-info">
                      <h3 className="book-title">{book.name}</h3>
                      <p className="book-category">{book.category}</p>
                      <div className="book-meta">
                        <span className="book-copies">{book.copies} copies</span>
                        <span className={`book-status ${book.status.toLowerCase()}`}>
                          {book.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-books">
                  <div className="no-books-icon">📚</div>
                  <h3>No Books Found</h3>
                  <p>This author doesn't have any books in the library yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorDetails;