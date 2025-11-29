import React, { useState } from 'react';
import api from '../../service/api';
import './styles/AddAuthor.css';

const AddAuthor = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    bio: ''
  });
  const [loading, setLoading] = useState(false);
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
      
      await api.post('/author', formData);
      alert('Author created successfully!');
      onNavigate('authors');
    } catch (err) {
      console.error('Error creating author:', err);
      setError(err.response?.data?.message || 'Failed to create author');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onNavigate('authors');
  };

  return (
    <div className="add-author-container">
      <div className="add-author-content">
        <div className="breadcrumbs">
          <button className="breadcrumb-link" onClick={() => onNavigate('authors')}>
            Authors
          </button>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Add New Author</span>
        </div>

        <div className="page-header">
          <h1>Add New Author</h1>
          <p>Create a new author profile for the library</p>
        </div>

        <form className="add-author-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Author Name *</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Enter author's full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Biography *</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows="8"
              required
              placeholder="Enter author's biography, background, and notable works..."
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="create-btn" disabled={loading}>
              {loading ? 'Creating...' : 'Create Author'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAuthor;