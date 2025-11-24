import React, { useState } from 'react';
import './Authors.css';

const Authors = ({ onNavigate, isAdmin = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const authors = [
    {
      id: 1,
      name: "George Orwell",
      birthYear: 1903,
      deathYear: 1950,
      biography: "An English novelist, essayist, journalist and critic, whose work is marked by lucid prose, biting social criticism, opposition to totalitarianism, and outspoken support of democratic socialism.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDzRAfgjiOspIzInblZrDRRJHfolN7IqfcrPQcieTzZ8uErs868GKAV9clyIZPKGRFiJjSxm9Xawawma4wqtZSKPU8aJonDSLbDofm_a3Kk-hnwGQzflp2WC0G1bjGAsR9K84fLQeiS0Zz3V-1-WznFp004CHce0GRcAvoSUi20PYbIQtXEHcknRPKOCXL_aVE1CfDrFWBVVSUuaFw09f7Q4DFlIOH3RLuMn7YtliqKhoZJUBtvJ7LJR-a_0DiNyOdpP3u9kR_o12c"
    },
    {
      id: 2,
      name: "Jane Austen",
      birthYear: 1775,
      deathYear: 1817,
      biography: "An English novelist known primarily for her six major novels, which interpret, critique and comment upon the British landed gentry at the end of the 18th century.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDrhXTUvczu9NKB-G-4kZxkj45T7uPKTvIRcMTDAZZpa4ryb2iFD8xVZWUMCGGWu6ou-moiClS8K0531uvu2D2tBYeSff6vlQjOT2YeU6mBn7FpJPlcMGzaUetyH41a0TZODj8_euFr6Xcce5uKcWVHFDVwAD8kUjCzQpIhX5zoftHERzPTmGUQsneMCml86B1FcWGx2B14neRS1t2amLhrWxNE8_uBfL66V1IB8Q2yU-3tLYrqqt5RbvVp9G6MGor7GI-YA6725wI"
    },
    {
      id: 3,
      name: "Mark Twain",
      birthYear: 1835,
      deathYear: 1910,
      biography: "An American writer, humorist, entrepreneur, publisher, and lecturer. He was lauded as the 'greatest humorist the United States has produced'.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBczLmTCsNbWZXerQemVAePxvkYeP2rmTRmbznl-OphKVEsCt9PWzKSWyRuutV8aiA_0Ixq-8sQ5IXRTRfw070BkffFqIVeOov22JbeFdBcaOwZFVguwHc3iGzEH_fGdyZr_vQN9hnJD_F0cqbbon8NaHhfFgeFURTgMJfBknMsRHEw6zdVb-tFuGod2qZFg6oE9D2_yjbKCKFbZ8-xdTFWaaULYgynXGBfows_HmT06onIZXKkNA6Hul5zW-W38-kz6x8Njgz691s"
    },
    {
      id: 4,
      name: "Virginia Woolf",
      birthYear: 1882,
      deathYear: 1941,
      biography: "An English writer, considered one of the most important modernist 20th-century authors and a pioneer in the use of stream of consciousness as a narrative device.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAlDG9DEL6W7zsSAV6DDZtZTxQEhO3vqxWyVRYBE8WWfqEAhxRAa04Tt6YGFJchheVz-96c0QctCPG51M9_8b3uG02kzOkrCEEujYb17J6hElPDu8GKI5KRpINfIG4JiRhhptGw5ZF_94syuSTkZs3vvnkUQr_SodmyBUsa_3It848_WREx5CFSWcWpbjE8g7Mu-7WMHoMgsg4QWsAH52UMm1LKanqYiLNCcQboZcaZ5mJZ74YYp32LkwtYksObR8IKMopWnCb-MEI"
    },
    {
      id: 5,
      name: "Ernest Hemingway",
      birthYear: 1899,
      deathYear: 1961,
      biography: "An American novelist, short-story writer, and journalist. His economical and understated style—which he termed the iceberg theory—had a strong influence on 20th-century fiction.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDX4wpU2nUdrUxI6u0no-qbqZd9mxW5o7PtD-PpHaUtvPAJ_n8L5C_CQgRLGDLihzfNLW5NH8Eu27ZBa1SandrI2X7C-xpQwy5GectRi6a0nE50pf7NpIUbs32brK9KxcrjW4FN-tYeiAQxfgy3Bpbr1vNiIPSlS-JQCSE7mazqZ8Fd58c0ITv79NfHR82v781vxXjRL31BOJrNV022sy09U8A42DiBRp1_ckY_iWyKgTgrPONDo1mdneL-IwF-jDSYr9OaGtu1Wfs"
    }
  ];

  const filteredAuthors = authors.filter(author =>
    author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    author.biography.toLowerCase().includes(searchQuery.toLowerCase())
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

  const handleDeleteAuthor = (authorId, authorName) => {
    if (window.confirm(`Are you sure you want to delete ${authorName}?`)) {
      console.log('Deleting author:', authorId);
    }
  };

  return (
    <div className="authors-container">
      <div className="authors-content">
        <div className="authors-header">
          <h1 className="authors-title">Authors</h1>
          
          <div className="authors-controls">
            <div className="search-container">
              <div className="search-input-wrapper">
                <span className="material-symbols-outlined search-icon">search</span>
                <input
                  type="text"
                  placeholder="Search authors..."
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {isAdmin && (
              <button className="add-author-btn" onClick={handleAddAuthor}>
                <span className="material-symbols-outlined">add</span>
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
                <tr key={author.id} className="author-row">
                  <td className="author-info">
                    <div className="author-avatar">
                      <img src={author.image} alt={author.name} className="author-image" />
                    </div>
                    <div className="author-details">
                      <h3 className="author-name">{author.name}</h3>
                      <p className="author-years">{author.birthYear} - {author.deathYear}</p>
                    </div>
                  </td>
                  <td className="author-biography">
                    <p>{author.biography}</p>
                  </td>
                  <td className="author-actions">
                    <button 
                      className="view-details-btn"
                      onClick={() => handleViewDetails(author.id)}
                    >
                      View Details
                    </button>
                    {isAdmin && (
                      <button 
                        className="delete-author-btn"
                        onClick={() => handleDeleteAuthor(author.id, author.name)}
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination">
          <button className="pagination-btn">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button className="pagination-btn active">1</button>
          <button className="pagination-btn">2</button>
          <button className="pagination-btn">3</button>
          <span className="pagination-ellipsis">...</span>
          <button className="pagination-btn">8</button>
          <button className="pagination-btn">9</button>
          <button className="pagination-btn">10</button>
          <button className="pagination-btn">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
}; 

export default Authors;