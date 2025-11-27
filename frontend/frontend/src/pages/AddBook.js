import React, { useState } from 'react';
import api, { Api_Endpoints } from '../service/api';
import './AddBook.css';

const AddBook = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    authorname: '',
    category: '',
    bookid: '',
    copies: '',
    status: 'Available',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // Validate required fields
      if (!formData.name || !formData.authorname || !formData.category || !formData.bookid || !formData.copies) {
        setError('Please fill in all required fields');
        return;
      }

      // Convert copies to number
      const bookData = {
        ...formData,
        copies: parseInt(formData.copies)
      };

      console.log('Adding book:', bookData);
      
      const response = await api.post(Api_Endpoints.BOOKS.CREATE_BOOK, bookData);
      console.log('Book added successfully:', response.data);

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        if (onNavigate) {
          onNavigate('books');
        }
      }, 2000);

      // Reset form
      setFormData({
        name: '',
        authorname: '',
        category: '',
        bookid: '',
        copies: '',
        status: 'Available',
        description: ''
      });

    } catch (err) {
      console.error('Error adding book:', err);
      setError(err.response?.data?.message || 'Failed to add book');
    } finally {
      setLoading(false);
    }
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
          <button 
            className="nav-item"
            onClick={() => onNavigate('admin-dashboard')}
          >
            <span>📊</span>
            <span>Dashboard</span>
          </button>
          <button 
            className="nav-item active"
            onClick={() => onNavigate('books')}
          >
            <span>📚</span>
            <span>Books</span>
          </button>
          <button 
            className="nav-item"
            onClick={() => onNavigate('authors')}
          >
            <span>👥</span>
            <span>Authors</span>
          </button>
        </nav>

        <button className="add-book-sidebar-btn" onClick={() => onNavigate('add-book')}>
          Add New Book
        </button>
      </div>

      <div className="add-book-main">
        <div className="add-book-content">
          <div className="page-header">
            <h1>Add a New Book</h1>
            <p>Fill in the details below to add a new book to the library catalogue.</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <span>❌</span>
              <span>{error}</span>
            </div>
          )}

          <form className="add-book-form" onSubmit={handleSubmit}>
            <div className="form-row full-width">
              <label>
                <span>Book Title *</span>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g., The Great Gatsby"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </label>
            </div>

            <div className="form-row">
              <label>
                <span>Author Name *</span>
                <input
                  type="text"
                  name="authorname"
                  placeholder="e.g., F. Scott Fitzgerald"
                  value={formData.authorname}
                  onChange={handleInputChange}
                  required
                />
              </label>
              
              <label>
                <span>Book ID *</span>
                <input
                  type="text"
                  name="bookid"
                  placeholder="e.g., 1001"
                  value={formData.bookid}
                  onChange={handleInputChange}
                  required
                />
              </label>
            </div>

            <div className="form-row">
              <label>
                <span>Category *</span>
                <input
                  type="text"
                  name="category"
                  placeholder="e.g., Fiction, Classic, Science"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                />
              </label>

              <label>
                <span>Number of Copies *</span>
                <input
                  type="number"
                  name="copies"
                  min="1"
                  placeholder="e.g., 5"
                  value={formData.copies}
                  onChange={handleInputChange}
                  required
                />
              </label>
            </div>

            <div className="form-row">
              <label>
                <span>Status</span>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="Available">Available</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
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
                ></textarea>
              </label>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-btn" 
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
              >
                {loading ? 'Adding Book...' : 'Add Book'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showSuccess && (
        <div className="success-toast">
          <span>✓</span>
          <span>Book Added Successfully!</span>
        </div>
      )}
    </div>
  );
};

export default AddBook;