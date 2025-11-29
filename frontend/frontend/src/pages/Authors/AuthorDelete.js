import React, { useState, useEffect } from 'react';
import api, { Api_Endpoints } from '../../service/api';
import './styles/AuthorDelete.css';

const AuthorDelete = ({ onNavigate, authorId }) => {
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
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
      setAuthor(response.data);
    } catch (err) {
      setError('Failed to fetch author data');
      console.error('Error fetching author:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to permanently delete "${author.name}"? This action cannot be undone.`)) {
      try {
        setDeleting(true);
        await api.delete(`/author/${authorId}`);
        alert('Author deleted successfully!');
        onNavigate('authors');
      } catch (err) {
        console.error('Error deleting author:', err);
        alert('Failed to delete author');
      } finally {
        setDeleting(false);
      }
    }
  };

  const handleCancel = () => {
    onNavigate('author-details', { authorId });
  };

  if (loading) {
    return (
      <div className="author-delete-container">
        <div className="loading">Loading author data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="author-delete-container">
        <div className="error">{error}</div>
        <button onClick={() => onNavigate('authors')} className="back-btn">
          Back to Authors
        </button>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="author-delete-container">
        <div className="error">Author not found</div>
        <button onClick={() => onNavigate('authors')} className="back-btn">
          Back to Authors
        </button>
      </div>
    );
  }

  return (
    <div className="author-delete-container">
      <div className="author-delete-content">
        <div className="breadcrumbs">
          <button className="breadcrumb-link" onClick={() => onNavigate('authors')}>
            Authors
          </button>
          <span className="breadcrumb-separator">/</span>
          <button className="breadcrumb-link" onClick={() => onNavigate('author-details', { authorId })}>
            Author Details
          </button>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Delete Author</span>
        </div>

        <div className="delete-warning">
          <div className="warning-icon">⚠️</div>
          <h1>Delete Author</h1>
          <p>You are about to delete the following author:</p>
          
          <div className="author-preview">
            <div className="author-avatar">
              <span className="author-initial">{author.name.charAt(0)}</span>
            </div>
            <div className="author-info">
              <h2>{author.name}</h2>
              <p>{author.bio || 'No biography'}</p>
            </div>
          </div>

          <div className="warning-message">
            <h3>This action cannot be undone!</h3>
            <p>All books by this author will remain in the system but will no longer be linked to this author.</p>
          </div>

          <div className="delete-actions">
            <button type="button" className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
            <button 
              type="button" 
              className="confirm-delete-btn" 
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete Author Permanently'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorDelete;