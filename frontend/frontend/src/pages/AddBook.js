import React, { useState } from 'react';
import './AddBook.css';

const AddBook = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    description: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Adding book:', formData);
    // In real app, you'd make API call here
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      if (onNavigate) {
        onNavigate('books');
      }
    }, 2000);
  };

  const handleCancel = () => {
    if (onNavigate) {
      onNavigate('books');
    }
  };

  return (
    <div className="add-book-container">
      <div className="add-book-sidebar">
        <div className="sidebar-header">
          <div className="logo"></div>
          <div className="admin-info">
            <h1>Admin Panel</h1>
            <p>Library System</p>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <a href="#dashboard" className="nav-item">
            <span className="material-symbols-outlined">grid_view</span>
            <span>Dashboard</span>
          </a>
          <a href="#books" className="nav-item active">
            <span className="material-symbols-outlined">menu_book</span>
            <span>Books</span>
          </a>
          <a href="#members" className="nav-item">
            <span className="material-symbols-outlined">groups</span>
            <span>Members</span>
          </a>
          <a href="#settings" className="nav-item">
            <span className="material-symbols-outlined">settings</span>
            <span>Settings</span>
          </a>
        </nav>

        <button className="add-book-sidebar-btn">
          Add New Book
        </button>
      </div>

      <div className="add-book-main">
        <div className="add-book-content">
          <div className="page-header">
            <h1>Add a New Book</h1>
            <p>Fill in the details below to add a new book to the library catalogue.</p>
          </div>

          <form className="add-book-form" onSubmit={handleSubmit}>
            <div className="form-row full-width">
              <label>
                <span>Book Title</span>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g., The Great Gatsby"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </label>
            </div>

            <div className="form-row">
              <label>
                <span>Author</span>
                <select
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select an author</option>
                  <option value="F. Scott Fitzgerald">F. Scott Fitzgerald</option>
                  <option value="George Orwell">George Orwell</option>
                  <option value="Jane Austen">Jane Austen</option>
                  <option value="J.K. Rowling">J.K. Rowling</option>
                  <option value="Stephen King">Stephen King</option>
                </select>
              </label>
              
              <label>
                <span>Category</span>
                <input
                  type="text"
                  name="category"
                  placeholder="e.g., Fiction, Classic"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                />
              </label>
            </div>

            <div className="form-row full-width">
              <label>
                <span>Description</span>
                <textarea
                  name="description"
                  placeholder="Enter a brief summary of the book..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  required
                ></textarea>
              </label>
            </div>

            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
              <button type="submit" className="submit-btn">
                Add Book
              </button>
            </div>
          </form>
        </div>
      </div>

      {showSuccess && (
        <div className="success-toast">
          <span className="material-symbols-outlined">check_circle</span>
          <span>Book Added Successfully</span>
        </div>
      )}
    </div>
  );
};

export default AddBook;