import axios from 'axios';

// Create axios instance with base URL from environment variables
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Remove trailing slash if present to avoid double slashes
const cleanBaseURL = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;

const api = axios.create({
  baseURL: cleanBaseURL,
  timeout: 60000, // 60 seconds timeout for long operations
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
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
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
