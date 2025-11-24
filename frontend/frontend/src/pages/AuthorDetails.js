import React from 'react';
import './AuthorDetails.css';

const AuthorDetails = ({ onNavigate, isAdmin = false }) => {
  const author = {
    id: 1,
    name: "J.R.R. Tolkien",
    birthYear: 1892,
    deathYear: 1973,
    biography: "John Ronald Reuel Tolkien was an English writer, poet, philologist, and academic, best known as the author of the high fantasy works The Hobbit and The Lord of the Rings. He served as the Rawlinson and Bosworth Professor of Anglo-Saxon and Fellow of Pembroke College, Oxford, from 1925 to 1945 and Merton Professor of English Language and Literature and Fellow of Merton College, Oxford, from 1945 to 1959.",
    books: [
      { id: 1, title: "The Lord of the Rings", year: 1954 },
      { id: 2, title: "The Hobbit", year: 1937 },
      { id: 3, title: "The Silmarillion", year: 1977 }
    ]
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

  const handleDeleteAuthor = () => {
    if (window.confirm(`Are you sure you want to delete ${author.name}?`)) {
      console.log('Deleting author:', author.id);
      handleBackToAuthors();
    }
  };

  return (
    <div className="author-details-container">
      <div className="author-details-content">
        <div className="author-details-header">
          <button className="back-button" onClick={handleBackToAuthors}>
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Authors
          </button>
        </div>

        <div className="author-main-section">
          <div className="author-info-card">
            <h1 className="author-name">{author.name}</h1>
            <p className="author-years">{author.birthYear} - {author.deathYear}</p>
            <p className="author-biography">{author.biography}</p>
            
            {isAdmin && (
              <button className="delete-author-btn" onClick={handleDeleteAuthor}>
                <span className="material-symbols-outlined">delete</span>
                Delete Author
              </button>
            )}
          </div>

          <div className="author-books-card">
            <h2 className="books-section-title">Books by this Author</h2>
            <div className="books-list">
              {author.books.map(book => (
                <div 
                  key={book.id} 
                  className="book-item"
                  onClick={() => handleBookClick(book.id)}
                >
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-year">{book.year}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorDetails;