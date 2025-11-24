import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Books from './pages/Books';
import Authors from './pages/Authors';
import AuthorDetails from './pages/AuthorDetails';
import BookDetails from './pages/BookDetails';
import AddBook from './pages/AddBook';
import Profile from './pages/Profile';
import CheckoutHistory from './pages/CheckoutHistory';
import AdminDashboard from './pages/AdminDashboard';
import PersonalCheckoutHistory from './pages/PersonalCheckoutHistory';
import EditBook from './pages/EditBook';


import api, { Api_Endpoints} from './service/api';

import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Set to true for testing
  const [userRole, setUserRole] = useState('admin'); // Set to 'admin' or 'user' for testing
  const [pageParams, setPageParams] = useState({});

  // Navigation function
  const navigateTo = (page, params = {}) => {
    console.log(`Navigating to: ${page}`, params);
    setCurrentPage(page);
    setPageParams(params);
  };

  // Mock login function - for testing without backend
  const handleLogin = async (email, password) => {
    
    console.log('HIIIIIIIIII')
    try {
      console.log(email, password)
      const response = await api.post(Api_Endpoints.AUTH.LOGIN, {
        email,
        password
      })

      console.log(response.data)
      setIsLoggedIn(true);
      setCurrentPage('home')
    }
    catch ( err){
      console.log('Went to error')
      console.log({Error: err.message})

    }
  };

  // Mock register function
  const handleRegister = async (name, email, password, role, adminkey) => {
    try{
      console.log(role, adminkey)
      console.log("Trying to Register")
      const response = await api.post(Api_Endpoints.AUTH.REGISTER, {
        name,
        email,
        password,
        role,
        adminkey,
      })

      console.log({Data: response.data})
      setIsLoggedIn(true);
      setUserRole(role);
      setCurrentPage('home');
      console.log('User registered and logged in');
    }
    catch(err){
      console.log(err)
    }
    
    
  };

  // Mock logout function
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('user');
    setCurrentPage('home');
    console.log('User logged out');
  };

  // Quick role switch for testing
  const switchToAdmin = () => {
    setUserRole('admin');
    console.log('Switched to admin role');
  };

  const switchToUser = () => {
    setUserRole('user');
    console.log('Switched to user role');
  };

  // Render the current page
  const renderCurrentPage = () => {
    console.log('Rendering page:', currentPage);
    
    switch (currentPage) {
      case 'home':
        return <Home isLoggedIn={isLoggedIn} onNavigate={navigateTo} />;
      case 'login':
        return <Login onLogin={handleLogin} onNavigate={navigateTo} />;
      case 'register':
        return <Register onRegister={handleRegister} onNavigate={navigateTo} />;
      case 'books':
        return <Books onNavigate={navigateTo} />;
      case 'authors':
        return <Authors onNavigate={navigateTo} />;
      case 'author-details':
        return <AuthorDetails onNavigate={navigateTo} />;
      case 'book-details':
        return <BookDetails onNavigate={navigateTo} />;
      case 'add-book':
        return <AddBook onNavigate={navigateTo} />;
      case 'profile':
        return <Profile onNavigate={navigateTo} isLoggedIn={isLoggedIn} userRole={userRole} />;
      case 'checkout-history':
        return <CheckoutHistory onNavigate={navigateTo} userRole={userRole} />;
      case 'admin-dashboard':
        return <AdminDashboard onNavigate={navigateTo} />;
      case 'personal-checkout-history':
        return <PersonalCheckoutHistory onNavigate={navigateTo} />;
      case 'edit-book':
        return <EditBook onNavigate={navigateTo} />;
      default:
        return <Home isLoggedIn={isLoggedIn} onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="App">
      {/* Quick Testing Controls - Remove in production */}
      <div className="testing-controls">
        <div className="testing-buttons">
          <button onClick={switchToAdmin} className="test-btn admin-btn">
            Switch to Admin
          </button>
          <button onClick={switchToUser} className="test-btn user-btn">
            Switch to User
          </button>
          <button onClick={handleLogout} className="test-btn logout-btn">
            Logout
          </button>
          <button onClick={handleLogin} className="test-btn login-btn">
            Login
          </button>
          <span className="status-indicator">
            Status: {isLoggedIn ? 'Logged In' : 'Logged Out'} | Role: {userRole}
          </span>
        </div>
      </div>

      <Navbar 
        isLoggedIn={isLoggedIn} 
        userRole={userRole}
        onLogout={handleLogout}
        onNavigate={navigateTo}
      />
      <main className="main-content">
        {renderCurrentPage()}
      </main>
      <Footer />
    </div>
  );
}

export default App;