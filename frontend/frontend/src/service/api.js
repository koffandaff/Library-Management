import axios from 'axios'; // for interaction 

const baseUrl = 'http://localhost:3000/api'

const api = axios.create({
    baseURL: baseUrl,
    timeout: 10000000000000000000000000000000,
    headers: {
        'Content-Type': 'application/json'
    }
})

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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      window.location.href = '/#login';
    }
    return Promise.reject(error);
  }
);

export const Api_Endpoints = {
    AUTH: {
        LOGIN: '/users/login',
        REGISTER: '/users/register',
        CURRENT: '/users/current'
    },
    BOOKS: {
        GET_ALLBOOKS: '/book'
    }
}

export default api;