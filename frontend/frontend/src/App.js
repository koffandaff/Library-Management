import React, { useState, useEffect } from 'react';
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

import api, { Api_Endpoints } from './service/api';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('user');
  const [pageParams, setPageParams] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const response = await api.get(Api_Endpoints.AUTH.CURRENT);
        console.log('Auth check response:', response.data);
        
        let userRoleFromResponse = 'user';
        
        if (response.data.user && response.data.user.user && response.data.user.user.role) {
          userRoleFromResponse = response.data.user.user.role;
        } else if (response.data.user && response.data.user.role) {
          userRoleFromResponse = response.data.user.role;
        }
        
        setIsLoggedIn(true);
        setUserRole(userRoleFromResponse);
        
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('authToken');
        setIsLoggedIn(false);
        setUserRole('user');
      }
    }
    setLoading(false);
  };

  const navigateTo = (page, params = {}) => {
    console.log(`Navigating to: ${page}`, params);
    
    const publicPages = ['home', 'login', 'register'];
    const adminPages = ['admin-dashboard', 'add-book', 'edit-book', 'checkout-history'];
    
    if (!publicPages.includes(page) && !isLoggedIn) {
      setCurrentPage('login');
      return;
    }
    
    if (adminPages.includes(page) && userRole !== 'admin') {
      setCurrentPage('home');
      return;
    }
    
    setCurrentPage(page);
    setPageParams(params);
  };

  const handleLogin = async (email, password) => {
    try {
      const response = await api.post(Api_Endpoints.AUTH.LOGIN, {
        email,
        password
      });

      const { accessToken, user } = response.data;
      
      localStorage.setItem('authToken', accessToken);
      setIsLoggedIn(true);
      
      let userRoleFromResponse = 'user';
      
      if (user && user.user && user.user.role) {
        userRoleFromResponse = user.user.role;
      } else if (user && user.role) {
        userRoleFromResponse = user.role;
      } else if (typeof user === 'string') {
        userRoleFromResponse = user.toLowerCase().includes('admin') ? 'admin' : 'user';
      }
      
      setUserRole(userRoleFromResponse);
      setCurrentPage('home');

    } catch (err) {
      console.log('Login failed:', err.response?.data || err.message);
      alert('Login failed. Please check your credentials.');
    }
  };

  const handleRegister = async (name, email, password, role, adminkey) => {
    try {
      const response = await api.post(Api_Endpoints.AUTH.REGISTER, {
        name,
        email,
        password,
        role,
        adminkey,
      });

      const { accessToken, user } = response.data;
      localStorage.setItem('authToken', accessToken);
      setIsLoggedIn(true);
      
      let userRoleFromResponse = role;
      
      if (user && user.user && user.user.role) {
        userRoleFromResponse = user.user.role;
      } else if (user && user.role) {
        userRoleFromResponse = user.role;
      }
      
      setUserRole(userRoleFromResponse);
      setCurrentPage('home');
      
    } catch (err) {
      console.log('Registration failed:', err);
      alert('Registration failed. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    setUserRole('user');
    setCurrentPage('home');
  };

  const ProtectedRoute = ({ children, requireAdmin = false }) => {
    if (!isLoggedIn) {
      return (
        <div className="protected-route">
          <h2>Authentication Required</h2>
          <p>Please log in to access this page.</p>
          <button onClick={() => navigateTo('login')} className="login-redirect-btn">
            Go to Login
          </button>
        </div>
      );
    }
    
    if (requireAdmin && userRole !== 'admin') {
      return (
        <div className="protected-route">
          <h2>Admin Access Required</h2>
          <p>You need administrator privileges to access this page.</p>
          <button onClick={() => navigateTo('home')} className="home-redirect-btn">
            Go to Home
          </button>
        </div>
      );
    }
    
    return children;
  };

  const renderCurrentPage = () => {
    if (loading) {
      return <div className="loading">Loading...</div>;
    }

    switch (currentPage) {
      case 'home':
        return <Home isLoggedIn={isLoggedIn} onNavigate={navigateTo} />;
      case 'login':
        return <Login onLogin={handleLogin} onNavigate={navigateTo} />;
      case 'register':
        return <Register onRegister={handleRegister} onNavigate={navigateTo} />;
      case 'books':
        return (
          <ProtectedRoute>
            <Books onNavigate={navigateTo} isLoggedIn={isLoggedIn} userRole={userRole} />
          </ProtectedRoute>
        );
      case 'authors':
        return (
          <ProtectedRoute>
            <Authors onNavigate={navigateTo} />
          </ProtectedRoute>
        );
      case 'author-details':
        return (
          <ProtectedRoute>
            <AuthorDetails onNavigate={navigateTo} />
          </ProtectedRoute>
        );
      case 'book-details':
        return (
          <ProtectedRoute>
            <BookDetails 
            onNavigate={navigateTo}
            isAdmin={userRole === 'admin'}
            bookId={pageParams.bookId} />
          </ProtectedRoute>
        );
      case 'profile':
        return (
          <ProtectedRoute>
            <Profile onNavigate={navigateTo} isLoggedIn={isLoggedIn} userRole={userRole} />
          </ProtectedRoute>
        );
      case 'personal-checkout-history':
        return (
          <ProtectedRoute>
            <PersonalCheckoutHistory onNavigate={navigateTo} />
          </ProtectedRoute>
        );
      case 'add-book':
        return (
          <ProtectedRoute requireAdmin={true}>
            <AddBook onNavigate={navigateTo} />
          </ProtectedRoute>
        );
      case 'edit-book':
        return (
          <ProtectedRoute requireAdmin={true}>
            <EditBook onNavigate={navigateTo} />
          </ProtectedRoute>
        );
      case 'checkout-history':
        return (
          <ProtectedRoute requireAdmin={true}>
            <CheckoutHistory onNavigate={navigateTo} userRole={userRole} />
          </ProtectedRoute>
        );
      case 'admin-dashboard':
        return (
          <ProtectedRoute requireAdmin={true}>
            <AdminDashboard onNavigate={navigateTo} />
          </ProtectedRoute>
        );
      default:
        return <Home isLoggedIn={isLoggedIn} onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="App">
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