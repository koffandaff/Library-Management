import React, { useState, useEffect } from 'react';
import api, { Api_Endpoints } from '../../service/api';
import './styles/AuthorUpdate.css';

const AuthorUpdate = ({ onNavigate, authorId }) => {
  const [formData, setFormData] = useState({
    name: '',
    bio: ''
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authorId) {
      fetchAuthorData();
    }
  }, [authorId]);

  const fetchAuthorData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/author/${authorId}`);
      const author = response.data;
      
      setFormData({
        name: author.name || '',
        bio: author.bio || ''
      });
    } catch (err) {
      setError('Failed to fetch author data');
      console.error('Error fetching author:', err);
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
    try {
      setUpdating(true);
      await api.put(`/author/${authorId}`, formData);
      alert('Author updated successfully!');
      onNavigate('author-details', { authorId });
    } catch (err) {
      console.error('Error updating author:', err);
      alert('Failed to update author');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    onNavigate('author-details', { authorId });
  };

  if (loading) {
    return (
      <div className="author-update-container">
        <div className="loading">Loading author data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="author-update-container">
        <div className="error">{error}</div>
        <button onClick={() => onNavigate('authors')} className="back-btn">
          Back to Authors
        </button>
      </div>
    );
  }

  return (
    <div className="author-update-container">
      <div className="author-update-content">
        <div className="breadcrumbs">
          <button className="breadcrumb-link" onClick={() => onNavigate('authors')}>
            Authors
          </button>
          <span className="breadcrumb-separator">/</span>
          <button className="breadcrumb-link" onClick={() => onNavigate('author-details', { authorId })}>
            Author Details
          </button>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Update Author</span>
        </div>

        <div className="page-header">
          <h1>Update Author</h1>
          <p>Edit the details for {formData.name}</p>
        </div>

        <form className="author-update-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Author Name *</label>
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
            <label htmlFor="bio">Biography</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows="6"
              placeholder="Enter author biography..."
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="update-btn" disabled={updating}>
              {updating ? 'Updating...' : 'Update Author'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthorUpdate;