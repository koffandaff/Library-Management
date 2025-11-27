import React, { useEffect, useState } from 'react';
import api, { Api_Endpoints } from '../service/api'
import './Books.css';

const Books = ({ onNavigate, isLoggedIn, userRole }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredBook, setHoveredBook] = useState(null);

  // Category & author 
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    fetchbooks(); 
  }, []);

  useEffect(() => {
    if (books.length > 0) {
      const uniqueCategories = [...new Set(books.map(book => book.category))].filter(Boolean);
      setCategories(uniqueCategories);

      const uniqueAuthors = [...new Set(books.map(book => book.authorname))].filter(Boolean);
      setAuthors(uniqueAuthors);
    }
  }, [books]);

  const fetchbooks = async () => {
    try {
      setLoading(true);
      const response = await api.get(Api_Endpoints.BOOKS.GET_ALLBOOKS);
      console.log("Book Data: ", response.data);
      setBooks(response.data);
    } catch (err) {
      setError('Failed to Fetch Books');
      console.error("Error Fetching books: ", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleAuthorChange = (e) => {
    setSelectedAuthor(e.target.value);
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedAuthor('');
    setSearchQuery('');
  };

  const handleBookClick = (bookId) => {
    if (onNavigate) {
      onNavigate('book-details', { bookId: bookId });
    }
  };

  const handleCheckout = async (bookId, e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      if (onNavigate) onNavigate('login');
      return;
    }

    try {
      // Find the book to check its availability
      const book = books.find(b => b._id === bookId);
      if (!book || book.copies < 1) {
        alert('No copies available for checkout');
        return;
      }

      // Use bookid (like 1001) for checkout, not MongoDB _id
      await api.post(`${Api_Endpoints.CHECKOUT.CHECKOUT_BOOK}/${book.bookid}`, {
        copies: 1
      });
      
      alert('Book checked out successfully!');
      // Refresh the books list to update availability
      fetchbooks();
    } catch (err) {
      console.error('Error checking out book:', err);
      const errorMessage = err.response?.data?.message || 'Failed to checkout book';
      alert(errorMessage);
    }
  };

  const handleAddBook = () => {
    if (!isLoggedIn) {
      if (onNavigate) onNavigate('login');
      return;
    }
    if (userRole !== 'admin') {
      alert('Only admins can add books');
      return;
    }
    if (onNavigate) onNavigate('add-book');
  };

  const handleEditBook = (bookId, e) => {
    e.stopPropagation();
    if (onNavigate) {
      onNavigate('edit-book', { bookId });
    }
  };

  const handleDeleteBook = async (bookId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await api.delete(`${Api_Endpoints.BOOKS.DELETE_BOOK}/${bookId}`);
        setBooks(books.filter(book => book._id !== bookId));
        alert('Book deleted successfully');
      } catch (err) {
        console.error('Error deleting book:', err);
        alert('Failed to delete book');
      }
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (book.authorname && book.authorname.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = !selectedCategory || book.category === selectedCategory;
    const matchesAuthor = !selectedAuthor || book.authorname === selectedAuthor;

    return matchesSearch && matchesCategory && matchesAuthor;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">📚</div>
        <p>Loading books...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">❌</div>
        <h3>Error Loading Books</h3>
      </div>
    );
  }

  return (
    <div className="books-page">
      <main className="books-main">
        <div className="books-container">
          {/* Page Title */}
          <div className="page-title-section">
            <h2 className="page-title">Library Collection</h2>
            <p>Total Books: {books.length}</p>
          </div>

          {/* Search and Controls */}
          <div className="controls-section">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search by book title or author..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="filters-section">
              {/* Category Filter */}
              <select
                className="filter-select"
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              {/* Author Filter */}
              <select
                className="filter-select"
                value={selectedAuthor}
                onChange={handleAuthorChange}
              >
                <option value="">All Authors</option>
                {authors.map(author => (
                  <option key={author} value={author}>
                    {author}
                  </option>
                ))}
              </select>

              {/* Clear Filters Button */}
              {(selectedCategory || selectedAuthor || searchQuery) && (
                <button
                  className="clear-filters-btn"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              )}

              <button
                className="add-book-btn"
                onClick={handleAddBook}
                disabled={!isLoggedIn || userRole !== 'admin'}
              >
                <span className="btn-icon">+</span>
                Add Book
              </button>
            </div>
          </div>

          {/* Active Filters Display */}
          {(selectedCategory || selectedAuthor) && (
            <div className="active-filters">
              <span>Active Filters: </span>
              {selectedCategory && (
                <span className="filter-tag">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory('')}>×</button>
                </span>
              )}
              {selectedAuthor && (
                <span className="filter-tag">
                  Author: {selectedAuthor}
                  <button onClick={() => setSelectedAuthor('')}>×</button>
                </span>
              )}
            </div>
          )}

          {/* Books Grid */}
          <div className="books-grid">
            {filteredBooks.map(book => (
              <div
                key={book._id}
                className="book-card"
                onClick={() => handleBookClick(book._id)}
                onMouseEnter={() => setHoveredBook(book._id)}
                onMouseLeave={() => setHoveredBook(null)}
              >
                <div className="book-image-container">
                  <div className="book-placeholder">
                    <span className="book-emoji">📖</span>
                  </div>
                  {/* Admin Actions - Only show on hover and for admin users */}
                  {isLoggedIn && userRole === 'admin' && hoveredBook === book._id && (
                    <div className="book-actions">
                      <button
                        className="action-btn edit-btn"
                        onClick={(e) => handleEditBook(book._id, e)}
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={(e) => handleDeleteBook(book._id, e)}
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="book-info">
                  <h3 className="book-title">{book.name}</h3>
                  <p className="book-author">{book.authorname}</p>

                  <div className="book-meta">
                    <span className="book-category">{book.category}</span>
                    <div className={`status-badge ${book.copies > 0 ? 'available' : 'unavailable'}`}>
                      {book.copies > 0 ? `${book.copies} Available` : 'Out of Stock'}
                    </div>
                  </div>

                  <button
                    className={`action-button ${book.copies > 0 ? 'available' : 'unavailable'}`}
                    onClick={(e) => handleCheckout(book._id, e)}
                    disabled={book.copies === 0 || !isLoggedIn}
                  >
                    {book.copies > 0 ? 'Checkout' : 'Unavailable'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredBooks.length === 0 && (
            <div className="empty-state">
              <span className="empty-icon">📚</span>
              <h3>No books found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Books;