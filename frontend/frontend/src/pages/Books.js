import React, { useState } from 'react';
import './Books.css';

const Books = ({ onNavigate, isLoggedIn, userRole }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredBook, setHoveredBook] = useState(null);
  
  const books = [
    {
      id: 1,
      title: "The Midnight Library",
      author: "Matt Haig",
      genre: "Fiction",
      status: "available",
      cover: "https://lh3.googleusercontent.com/aida-public/AB6AXuBEcDIRaOTvoo3_c4291bO613K5EAm4ITZLilRvaoZ2m6kEM8LfwO7iE2xi2flD-PiRSomsTngj8d5XOjREsCgaW2IwdJDinqDsjFa6aYxOQ-ovXZ7ydOGxbnZ2aAmZSz-41nV8MnARCiHUfT8tthCqjVbi-OV38gOtOLZd1-Q0O2GyrfUjW9E1Fpc-RnGn7dDimQ2twD1NC2cUq5O1F0FfX0SMV6ptx0uJPF4GlOLwxRQMQz_cmr3xIyS_gvmk3gMGdepP9yFhM5M"
    },
    {
      id: 2,
      title: "The Silent Patient",
      author: "Alex Michaelides",
      genre: "Thriller",
      status: "checked-out",
      cover: "https://lh3.googleusercontent.com/aida-public/AB6AXuATnY-yCue7Lcw20R_0qut8fJLMx2BG0Ho-8rOFTBr0fUM30Q6ua3CY86lReZeSc49vBN_xk0ibn06vFjUJoP09T8BU6SGkGIMTgtsEe55UkGXrPGnjYSiLDgNNb7xGLjgDdIEwMNxWh-1yB15O3dtgCsI_71NkzmlP7h2COTSlypU_7OuIpL8jhBz66FhgexaZOIB6lyCdoG5BRSswVpj3kjJLUZJhTOutmUMMyOz31yjQ3-7nbprZEB9uAlpP6UWXgJDEiS88x9g"
    },
    {
      id: 3,
      title: "Atomic Habits",
      author: "James Clear",
      genre: "Non-Fiction",
      status: "available",
      cover: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQikmVqyG08vJ1jklgUdr2Q-3sAxhSqZir1w8TGv7podqamr4bRz0k-q7ae4CAAyMt7cfZJCYizMX5wkC3mYhmknTDjC4TxARAAHXFJqAIFwfxVHdbYbd7Gte_QgIoH7hI1qYtlxiNv6BGmvw0Tlbii_mMsd57bXurXxmWFwjDMIjFT-wl1IOq-gM4NnjHOA1ldV6lw_SDER9NLOIh7P7YRbxt6QVm3JxmDsrvnx01UhGXhTo6-63fXrSEwuXAeIgTLuwOhU9hMRI"
    },
    {
      id: 4,
      title: "Where the Crawdads Sing",
      author: "Delia Owens",
      genre: "Fiction",
      status: "available",
      cover: "https://lh3.googleusercontent.com/aida-public/AB6AXuDi_LYvST1XUKCus8JEa_srjyfFTif3uCUTUu1S5Ar_t18FJKiAq4ARYzdU4hFRf0_UHYJ6Ye9y6_orzWALjDFDxeFe2JQNlfICz4envqpFOU8CejLOF7Qx5MFFED1C3flOZ82UzNEymt9U2cxwqECw9aCFyoMra_tOcPOvRxlNuuN5talCi-Baz0fv0C8EjYKQMZhmmXarLbPatx0oKNLZUbTLEwXINhXqVzoS781za-bf6H7tgfjtPlkf3T0xTvS0X9Ud4xuW35s"
    }
  ];

  const handleBookClick = (bookId) => {
    if (onNavigate) {
      onNavigate('book-details', { bookId });
    }
  };

  const handleCheckout = (bookId, e) => {
    e.stopPropagation(); // Prevent triggering the book click
    if (!isLoggedIn) {
      if (onNavigate) onNavigate('login');
      return;
    }
    console.log('Checkout book:', bookId);
    // In real app, you'd make API call here
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
    console.log('Add book clicked');
    // Navigate to add book page
  };

  const handleEditBook = (bookId, e) => {
    // e.stopPropagation(); // Prevent triggering the book click
    console.log('Edit book:', bookId);
    // Navigate to edit book page
  };

  const handleDeleteBook = (bookId, e) => {
    e.stopPropagation(); // Prevent triggering the book click
    if (window.confirm('Are you sure you want to delete this book?')) {
      console.log('Delete book:', bookId);
      // Delete book API call
    }
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="books-page">
      {/* Main Content */}
      <main className="books-main">
        <div className="books-container">
          {/* Page Title */}
          <div className="page-title-section">
            <h2 className="page-title">Library Collection</h2>
          </div>

          {/* Search and Controls */}
          <div className="controls-section">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search by book title..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="filters-section">
              <select className="filter-select">
                <option>Category</option>
                <option>Fiction</option>
                <option>Non-Fiction</option>
                <option>Thriller</option>
              </select>
              
              <select className="filter-select">
                <option>Author</option>
                <option>Matt Haig</option>
                <option>Alex Michaelides</option>
                <option>James Clear</option>
                <option>Delia Owens</option>
              </select>
              
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

          {/* Books Grid */}
          <div className="books-grid">
            {filteredBooks.map(book => (
              <div 
                key={book.id} 
                className="book-card"
                onClick={() => handleBookClick(book.id)}
                onMouseEnter={() => setHoveredBook(book.id)}
                onMouseLeave={() => setHoveredBook(null)}
              >
                <div className="book-image-container">
                  <img 
                    src={book.cover} 
                    alt={book.title}
                    className="book-image"
                  />
                  
                  {/* Admin Actions - Only show on hover and for admin users */}
                  {isLoggedIn && userRole === 'admin' && hoveredBook === book.id && (
                    <div className="book-actions">
                      <button 
                        className="action-btn edit-btn"
                        onClick={(e) => handleEditBook(book.id, e)}
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <button 
                        className="action-btn delete-btn"
                        onClick={(e) => handleDeleteBook(book.id, e)}
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="book-info">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">{book.author}</p>
                  
                  <div className="book-meta">
                    <span className="book-genre">{book.genre}</span>
                    <div className={`status-badge ${book.status}`}>
                      {book.status === 'available' ? 'Available' : 'Checked Out'}
                    </div>
                  </div>
                  
                  <button
                    className={`action-button ${book.status}`}
                    onClick={(e) => handleCheckout(book.id, e)}
                    disabled={book.status !== 'available' || !isLoggedIn}
                  >
                    {book.status === 'available' ? 'Checkout' : 'Unavailable'}
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