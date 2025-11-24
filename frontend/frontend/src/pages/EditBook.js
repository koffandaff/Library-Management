import React, { useState } from 'react';
import './EditBook.css';

const EditBook = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    title: "The Midnight Library",
    author: "Matt Haig",
    category: "Fantasy",
    description: "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. To see how things would be if you had made other choices . . . Would you have done anything different, if you had the chance to undo your regrets?"
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
    console.log('Updating book:', formData);
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
    <div className="edit-book-container">
      <div className="edit-book-content">
        {/* Breadcrumbs */}
        <div className="breadcrumbs">
          <button className="breadcrumb-link" onClick={() => onNavigate('admin-dashboard')}>
            Admin Dashboard
          </button>
          <span className="breadcrumb-separator">/</span>
          <button className="breadcrumb-link" onClick={() => onNavigate('books')}>
            Books
          </button>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Edit Book</span>
        </div>

        {/* Page Header */}
        <div className="page-header">
          <h1>Edit Book</h1>
          <p>Update the details for "{formData.title}" below.</p>
        </div>

        {/* Edit Form */}
        <form className="edit-book-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="title">Book Title</label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="author">Author</label>
              <input
                id="author"
                name="author"
                type="text"
                value={formData.author}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="Science Fiction">Science Fiction</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Mystery">Mystery</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Romance">Romance</option>
                <option value="Thriller">Thriller</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="6"
                required
              ></textarea>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="update-btn">
              <span className="material-symbols-outlined">sync</span>
              Update Book
            </button>
          </div>
        </form>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="success-toast">
          <div className="toast-icon">
            <span className="material-symbols-outlined">check_circle</span>
          </div>
          <div className="toast-content">
            <h4>Success</h4>
            <p>Book details updated successfully!</p>
          </div>
          <button 
            className="toast-close"
            onClick={() => setShowSuccess(false)}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default EditBook;