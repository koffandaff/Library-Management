import React, { useState, useEffect } from 'react';
import api from '../../service/api';
import './styles/Authors.css';

const Authors = ({ onNavigate, isAdmin = false }) => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/author');
      setAuthors(response.data);
    } catch (err) {
      setError('Failed to fetch authors');
      console.error('Error fetching authors:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAuthors = authors.filter(author =>
    author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (author.bio && author.bio.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleViewDetails = (authorId) => {
    if (onNavigate) {
      onNavigate('author-details', { authorId });
    }
  };

  const handleAddAuthor = () => {
    if (onNavigate) {
      onNavigate('add-author');
    }
  };

  const handleDeleteAuthor = async (authorId, authorName) => {
    if (window.confirm(`Are you sure you want to delete ${authorName}?`)) {
      try {
        await api.delete(`/author/${authorId}`);
        alert('Author deleted successfully!');
        fetchAuthors();
      } catch (err) {
        console.error('Error deleting author:', err);
        alert('Failed to delete author');
      }
    }
  };

  // Cool author icons based on name
  const getAuthorIcon = (name) => {
    const icons = ['📚', '✍️', '📖', '🖋️', '📝', '🎨', '🌟', '💫', '🔥', '⭐'];
    const index = name.charCodeAt(0) % icons.length;
    return icons[index];
  };

  if (loading) {
    return (
      <div className="authors-container">
        <div className="loading">
          <div className="loading-icon">📚</div>
          <p>Loading authors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="authors-container">
        <div className="error">
          <div className="error-icon">❌</div>
          <h3>{error}</h3>
          <button onClick={fetchAuthors} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="authors-container">
      <div className="authors-content">
        <div className="authors-header">
          <h1 className="authors-title">Authors</h1>
          
          <div className="authors-controls">
            <div className="search-container">
              <div className="search-input-wrapper">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search authors by name or biography..."
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {isAdmin && (
              <button className="add-author-btn" onClick={handleAddAuthor}>
                <span className="btn-icon">➕</span>
                <span>Add Author</span>
              </button>
            )}
          </div>
        </div>

        <div className="authors-table-container">
          <table className="authors-table">
            <thead className="authors-table-header">
              <tr>
                <th className="author-column">Author</th>
                <th className="biography-column">Biography</th>
                <th className="actions-column">Actions</th>
              </tr>
            </thead>
            <tbody className="authors-table-body">
              {filteredAuthors.map(author => (
                <tr key={author._id} className="author-row">
                  <td className="author-info">
                    <div className="author-avatar">
                      <div className="author-icon">
                        {getAuthorIcon(author.name)}
                      </div>
                    </div>
                    <div className="author-details">
                      <h3 className="author-name">{author.name}</h3>
                    </div>
                  </td>
                  <td className="author-biography">
                    <p>{author.bio || 'No biography available'}</p>
                  </td>
                  <td className="author-actions">
                    <button 
                      className="view-details-btn"
                      onClick={() => handleViewDetails(author._id)}
                    >
                      <span className="btn-icon">👁️</span>
                      View Details
                    </button>
                    {isAdmin && (
                      <button 
                        className="delete-author-btn"
                        onClick={() => handleDeleteAuthor(author._id, author.name)}
                      >
                        <span className="btn-icon">🗑️</span>
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAuthors.length === 0 && authors.length > 0 && (
          <div className="empty-search-state">
            <div className="empty-icon">🔍</div>
            <h3>No authors found</h3>
            <p>Try adjusting your search criteria</p>
          </div>
        )}

        {authors.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">✍️</div>
            <h3>No authors yet</h3>
            <p>Get started by adding the first author to the library</p>
            {isAdmin && (
              <button className="add-author-btn empty-state-btn" onClick={handleAddAuthor}>
                <span className="btn-icon">➕</span>
                Add First Author
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}; 

export default Authors;