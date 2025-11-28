import axios from 'axios';

const baseUrl = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: baseUrl,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for automatic token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't try to refresh token for login requests or if no token exists
    const isLoginRequest = originalRequest.url?.includes('/login');
    const hasToken = localStorage.getItem('authToken');
    
    // If error is 401, we haven't tried refreshing yet, it's NOT a login request, and we have a token
    if (error.response?.status === 401 && 
        !originalRequest._retry && 
        !isLoginRequest && 
        hasToken) {
      
      originalRequest._retry = true;

      try {
        console.log('Access token expired, attempting refresh...');
        
        const refreshResponse = await api.post('/users/refresh');
        
        const { accessToken } = refreshResponse.data;
        localStorage.setItem('authToken', accessToken);
        
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        console.log('Token refreshed successfully, retrying original request...');
        return api(originalRequest);
        
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError.response?.data || refreshError.message);
        
        // Clear everything on refresh failure
        localStorage.removeItem('authToken');
        
        // Redirect to login only if we're not already there
        if (!window.location.href.includes('/login')) {
          window.location.href = '/#login';
        }
        
        return Promise.reject(refreshError);
      }
    }

    // For login 401 errors or other 401 errors without token, just reject normally
    return Promise.reject(error);
  }
);

export const Api_Endpoints = {
    AUTH: {
        LOGIN: '/users/login',
        REGISTER: '/users/register',
        REFRESH: '/users/refresh',
        CURRENT: '/users/current',
        FORGOT_PASSWORD: '/users/forgot-password',
        VERIFY_OTP: '/users/verify-otp',
        RESET_PASSWORD: '/users/reset-password',
        RESEND_OTP: '/users/resend-otp',
        LOGOUT: '/users/logout'
    },
    BOOKS: {
        GET_ALLBOOKS: '/book',
        GET_BOOK_DETAILS: '/book/id',
        UPDATE_BOOK: '/book',
        CREATE_BOOK: '/book',
        DELETE_BOOK: '/book'
    },
    CHECKOUT: {
        CHECKOUT_BOOK: '/checkout',
        RETURN_BOOK: '/checkout/return',
        PERSONAL_HISTORY: '/checkout/me',
        ALL_HISTORY: '/checkout/all'
    },
    USER: {
        GET_ALL: '/users',
        DELETE: '/users/delete'
    }
}

export default api;