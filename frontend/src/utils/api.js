import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

/**
 * Request Interceptor - adds the Auth Token automatically
 * @returns {Promise} The modified request config.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor - handles invalid tokens
 * @returns {Promise} The response or error.
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
      
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
