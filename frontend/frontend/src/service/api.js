import axios from 'axios';

const baseUrl = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: baseUrl,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
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

    // If error is 401 (Unauthorized) and we haven't tried refreshing yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log('Access token expired, attempting refresh...');
        
        const refreshResponse = await axios.post(
          `${baseUrl}/users/refresh`,
          {},
          { 
            withCredentials: true // Important for httpOnly cookies
          }
        );

        const { accessToken } = refreshResponse.data;
        localStorage.setItem('authToken', accessToken);
        
        // Update the authorization header for the retry
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        console.log('Token refreshed successfully, retrying original request...');
        
        // Retry the original request with new token
        return api(originalRequest);
        
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        
        // Refresh failed - clear tokens and redirect to login
        localStorage.removeItem('authToken');
        
        // Only redirect if we're not already on login page
        if (!window.location.href.includes('/login')) {
          window.location.href = '/#login';
        }
        
        return Promise.reject(refreshError);
      }
    }

    // Handle other 401 errors (not token expiration)
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      if (!window.location.href.includes('/login')) {
        window.location.href = '/#login';
      }
    }

    return Promise.reject(error);
  }
);

export const Api_Endpoints = {
    AUTH: {
        LOGIN: '/users/login',
        REGISTER: '/users/register',
        REFRESH: '/users/refresh',
        CURRENT: '/users/current' 
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