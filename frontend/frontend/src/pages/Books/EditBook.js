import React, { useState, useEffect } from 'react';
import api, { Api_Endpoints } from '../../service/api';
import './styles/EditBook.css';

const EditBook = ({ onNavigate , bookId}) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    description: "",
    copies: ""

  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null);

  useEffect(() => {
    if (bookId) {
      fetchBookData();
    }
  }, [bookId]);

  const fetchBookData = async () => {
    try {
      console.log("sadfnsdfnsdf", "Id:   ",bookId)
      setLoading(true);
      const response = await api.get(`${Api_Endpoints.BOOKS.GET_BOOK_DETAILS}/${bookId}`);
      console.log(response.data)
      console.log(response.data.Book)
      const book = response.data.Book
      console.log('Book: ', book)
      setFormData({
        name: book.name || "",
        authorname: book.authorname || "",
        category: book.category || "",
        bookId: book.bookid || "",
        copies: book.copies?.toString() || "",
        status: book.status || "Available",
        description: book.description || ""
      });
    } catch (err) {
      setError('Failed to fetch book data');
      console.error('Error fetching book:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Updating book:', formData);
    const response = await api.put(`${Api_Endpoints.BOOKS.UPDATE_BOOK}/${bookId}`, {
      name: formData.name,
      authorname: formData.name,
      bookid: formData.bookId,
      description: formData.description,
      category: formData.category,
      copies: formData.copies,
      status: formData.status
      

    })
    console.log(response)
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
      onNavigate('book-details', { bookId });
    }
  };

  if (loading) {
    return (
      <div className="edit-book-container">
        <div className="loading">Loading book data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="edit-book-container">
        <div className="error-container">
          <h3>{error}</h3>
          <button onClick={() => onNavigate('books')} className="back-btn">
            Back to Books
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-book-container">
      <div className="edit-book-content">
        {/* Breadcrumbs */}
        <div className="breadcrumbs">
          <button className="breadcrumb-link" onClick={() => onNavigate('books')}>
            Books
          </button>
          <span className="breadcrumb-separator">/</span>
          <button className="breadcrumb-link" onClick={() => onNavigate('book-details', { bookId })}>
            Book Details
          </button>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Edit Book</span>
        </div>

        {/* Page Header */}
        <div className="page-header">
          <h1>Edit Book</h1>
          <p>Update the details for "{formData.name}" below.</p>
        </div>

        {/* Edit Form */}
        <form className="edit-book-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Book Title *</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="authorname">Author *</label>
              <input
                id="authorname"
                name="authorname"
                type="text"
                value={formData.authorname}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="bookid">Book ID *</label>
              <input
                id="bookid"
                name="bookid"
                type="text"
                value={formData.bookId}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <input
                id="category"
                name="category"
                type="text"
                value={formData.category}
                onChange={handleInputChange}
                required
                placeholder="e.g., Fiction, Science, Manga"
              />
            </div>

            <div className="form-group">
              <label htmlFor="copies">Number of Copies *</label>
              <input
                id="copies"
                name="copies"
                type="number"
                min="0"
                value={formData.copies}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Status *</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
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
                placeholder="Enter a description for the book..."
              ></textarea>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="update-btn">
              Update Book
            </button>
          </div>
        </form>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="success-toast">
          <div className="toast-icon">✓</div>
          <div className="toast-content">
            <h4>Success</h4>
            <p>Book details updated successfully!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditBook;