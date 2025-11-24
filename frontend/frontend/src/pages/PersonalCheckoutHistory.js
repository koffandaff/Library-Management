import React from 'react';
import './PersonalCheckoutHistory.css';

const PersonalCheckoutHistory = ({ onNavigate }) => {
  const user = {
    name: "Eleanor Vance",
    email: "eleanor.v@email.com",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDFnCJGd66gT-EH1ZzWBUUpyulV8hIZmZGaGcg_ryGGYHdUoyyhxa6IazksAl9IwdLv5CDOZhX3Go9QVBOyUEVS6v2yeLv-hzq2Gsdq2B-uRICemxbjEvqu7wjNPnGc0fS7G7VsQTWhW6JYcm4FnHjlRoGdK_6hJ-CdUA2GihEdXyGMhLsaAgQZOS6_fjEOyOfXNlIWBiK1hqV66pSjHP-b9fsqGEofDbLrrM0CEJfKc_eipKc9gDfk9RahRKKi-zewhtlA2G-ymI"
  };

  const checkouts = [
    {
      id: 1,
      bookTitle: "The Midnight Library",
      checkoutDate: "2023-10-26",
      status: "active",
      dueDate: "2023-11-26"
    },
    {
      id: 2,
      bookTitle: "Dune",
      checkoutDate: "2023-09-15",
      status: "returned",
      returnDate: "2023-10-01"
    },
    {
      id: 3,
      bookTitle: "Project Hail Mary",
      checkoutDate: "2023-08-20",
      status: "returned",
      returnDate: "2023-09-10"
    },
    {
      id: 4,
      bookTitle: "Klara and the Sun",
      checkoutDate: "2023-07-01",
      status: "returned",
      returnDate: "2023-07-29"
    },
    {
      id: 5,
      bookTitle: "The Four Winds",
      checkoutDate: "2023-05-18",
      status: "returned",
      returnDate: "2023-06-15"
    }
  ];

  const getStatusBadge = (status) => {
    if (status === 'active') {
      return (
        <span className="status-badge active">
          <span className="status-dot"></span>
          Active
        </span>
      );
    } else {
      return (
        <span className="status-badge returned">
          <span className="status-dot"></span>
          Returned
        </span>
      );
    }
  };

  const handleBookClick = (bookTitle) => {
    if (onNavigate) {
      onNavigate('book-details');
    }
  };

  const handleBrowseBooks = () => {
    if (onNavigate) {
      onNavigate('books');
    }
  };

  return (
    <div className="personal-checkout-container">
      {/* Sidebar */}
      <aside className="checkout-sidebar">
        <div className="sidebar-header">
          <div className="library-icon">
            <span className="material-symbols-outlined">local_library</span>
          </div>
          <h2>Library System</h2>
        </div>

        <div className="user-info">
          <div 
            className="user-avatar"
            style={{ backgroundImage: `url(${user.avatar})` }}
          ></div>
          <div className="user-details">
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item" onClick={() => onNavigate('home')}>
            <span className="material-symbols-outlined">home</span>
            <span>Home</span>
          </button>
          <button className="nav-item" onClick={() => onNavigate('books')}>
            <span className="material-symbols-outlined">import_contacts</span>
            <span>Browse Books</span>
          </button>
          <button className="nav-item active">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              history
            </span>
            <span>My History</span>
          </button>
          <button className="nav-item" onClick={() => onNavigate('profile')}>
            <span className="material-symbols-outlined">account_circle</span>
            <span>My Account</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item">
            <span className="material-symbols-outlined">settings</span>
            <span>Settings</span>
          </button>
          <button className="nav-item" onClick={() => onNavigate('home')}>
            <span className="material-symbols-outlined">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="checkout-main">
        <div className="checkout-content">
          <div className="page-header">
            <h1>My Checkout History</h1>
            <p>A record of all the books you've checked out from the library.</p>
          </div>

          {checkouts.length > 0 ? (
            <div className="checkout-table-container">
              <table className="checkout-table">
                <thead>
                  <tr>
                    <th>Book Title</th>
                    <th>Checkout Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {checkouts.map((checkout) => (
                    <tr key={checkout.id}>
                      <td className="book-title">
                        <button 
                          className="book-link"
                          onClick={() => handleBookClick(checkout.bookTitle)}
                        >
                          {checkout.bookTitle}
                        </button>
                      </td>
                      <td className="checkout-date">{checkout.checkoutDate}</td>
                      <td>{getStatusBadge(checkout.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <span className="material-symbols-outlined">menu_book</span>
              </div>
              <h3>No Checkout History</h3>
              <p>You haven't checked out any books yet. Start exploring our collection to find your next great read.</p>
              <button className="browse-books-btn" onClick={handleBrowseBooks}>
                Browse Books
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PersonalCheckoutHistory;