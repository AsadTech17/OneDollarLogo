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
    
    // Debug logging for credits balance endpoint
    if (config.url?.includes('/api/credits/balance')) {
      console.log('Making request to /api/credits/balance');
      console.log('Token available:', !!token);
      console.log('Token length:', token?.length || 0);
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      
      if (config.url?.includes('/api/credits/balance')) {
        console.log('Authorization header set:', config.headers.Authorization.substring(0, 20) + '...');
      }
    } else {
      if (config.url?.includes('/api/credits/balance')) {
        console.warn('No auth token found in localStorage for credits balance request');
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Debug logging for credits balance endpoint
    if (response.config.url?.includes('/api/credits/balance')) {
      console.log('Credits balance response status:', response.status);
      console.log('Credits balance response data:', response.data);
    }
    return response;
  },
  (error) => {
    // Debug logging for credits balance endpoint errors
    if (error.config?.url?.includes('/api/credits/balance')) {
      console.error('Credits balance request failed:', error.response?.status);
      console.error('Credits balance error data:', error.response?.data);
      console.error('Credits balance error headers:', error.response?.headers);
    }
    
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
