import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Books from './pages/Books/Books';
import Authors from './pages/Authors/Authors';
import AddAuthor from './pages/Authors/AddAuthor';
import AuthorDetails from './pages/Authors/AuthorDetails';
import AuthorUpdate from './pages/Authors/AuthorUpdate';
import AuthorDelete from './pages/Authors/AuthorDelete';
import BookDetails from './pages/Books/BookDetails';
import AddBook from './pages/Books/AddBook';
import Profile from './pages/User/Profile';
import CheckoutHistory from './pages/Admin/CheckoutHistory';
import AdminDashboard from './pages/Admin/AdminDashboard';
import PersonalCheckoutHistory from './pages/User/PersonalCheckoutHistory';
import EditBook from './pages/Books/EditBook';
import ForgotPassword from './pages/Auth/ForgotPassword';
import VerifyOtp from './pages/Auth/VerifyOtp';
import ResetPassword from './pages/Auth/ResetPassword';

import api, { Api_Endpoints } from './service/api';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('user');
  const [pageParams, setPageParams] = useState({});
  const [loading, setLoading] = useState(false); // Start as false

  useEffect(() => {
    // Simple auth check - don't call API on app load to avoid token refresh loops
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
      // You can decode the token to get role if needed, but don't call API
    }
    setLoading(false);
  }, []);

  // Navigation function
  const navigateTo = (page, params = {}) => {
    console.log(`Navigating to: ${page}`, params);
    
    const publicPages = ['home', 'login', 'register','forgot-password','verify-otp','reset-password'];
    const adminPages = ['admin-dashboard', 'add-book', 'edit-book', 'checkout-history', 'author-update', 'author-delete', 'add-author'];
    
    if (!publicPages.includes(page) && !isLoggedIn) {
      setCurrentPage('login');
      return;
    }
    
    if (adminPages.includes(page) && userRole !== 'admin') {
      setCurrentPage('home');
      alert('Access denied. Admin privileges required.');
      return;
    }
    
    setCurrentPage(page);
    setPageParams(params);
  };

  // Handle user login
  const handleLogin = async (email, password) => {
    try {
      const response = await api.post(Api_Endpoints.AUTH.LOGIN, {
        email,
        password
      });

      const { accessToken, user } = response.data;
      
      localStorage.setItem('authToken', accessToken);
      setIsLoggedIn(true);
      setUserRole(user.role || 'user');
      setCurrentPage('home');
      
      console.log('Login successful, role:', user.role);

    } catch (err) {
      console.log('Login failed:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      alert(errorMessage);
    }
  };

  // Handle user registration
  const handleRegister = async (name, email, password, role, adminkey) => {
    try {
      await api.post(Api_Endpoints.AUTH.REGISTER, {
        name,
        email,
        password,
        role,
        adminkey,
      });

      alert('Registration successful! Please log in with your credentials.');
      setCurrentPage('login');
      
    } catch (err) {
      console.log('Registration failed:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      alert(errorMessage);
    }
  };

  // Handle user logout
  const handleLogout = async () => {
    try {
      await api.post(Api_Endpoints.AUTH.LOGOUT, {}, { 
        withCredentials: true,
        timeout: 3000
      });
    } catch (err) {
      console.log('Logout API call had issues:', err.message);
    } finally {
      localStorage.removeItem('authToken');
      setIsLoggedIn(false);
      setUserRole('user');
      setCurrentPage('home');
      console.log('User logged out successfully');
    }
  };

  // Protected route component
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

  // Render the current page based on state
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
      case 'forgot-password':
        return <ForgotPassword onNavigate={navigateTo} />;
      case 'verify-otp':
        return <VerifyOtp onNavigate={navigateTo} pageParams={pageParams} />;
      case 'reset-password':
        return <ResetPassword onNavigate={navigateTo} pageParams={pageParams} />;
      case 'books':
        return (
          <ProtectedRoute>
            <Books onNavigate={navigateTo} isLoggedIn={isLoggedIn} userRole={userRole} />
          </ProtectedRoute>
        );
      case 'authors':
        return (
          <ProtectedRoute>
            <Authors onNavigate={navigateTo} isAdmin={userRole === 'admin'} />
          </ProtectedRoute>
        );
      case 'add-author':
        return (
          <ProtectedRoute requireAdmin={true}>
            <AddAuthor onNavigate={navigateTo} />
          </ProtectedRoute>
        );
      case 'author-details':
        return (
          <ProtectedRoute>
            <AuthorDetails 
              onNavigate={navigateTo} 
              isAdmin={userRole === 'admin'}
              authorId={pageParams.authorId}
            />
          </ProtectedRoute>
        );
      case 'author-update':
        return (
          <ProtectedRoute requireAdmin={true}>
            <AuthorUpdate 
              onNavigate={navigateTo}
              authorId={pageParams.authorId}
            />
          </ProtectedRoute>
        );
      case 'author-delete':
        return (
          <ProtectedRoute requireAdmin={true}>
            <AuthorDelete 
              onNavigate={navigateTo}
              authorId={pageParams.authorId}
            />
          </ProtectedRoute>
        );
      case 'book-details':
        return (
          <ProtectedRoute>
            <BookDetails 
              onNavigate={navigateTo}
              isAdmin={userRole === 'admin'}
              bookId={pageParams.bookId} 
            />
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
            <EditBook 
              onNavigate={navigateTo}
              bookId={pageParams.bookId} 
            />
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