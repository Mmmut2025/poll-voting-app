import axios from 'axios';

const API = axios.create({
  baseURL: 'http://15.206.203.217:5000/api', // ✅ Adjust if backend runs on a different port or domain
});

// ✅ Attach token to every request
API.interceptors.request.use(
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

// ✅ Optional: Handle global errors like 401 (unauthorized)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized or session expired');
      localStorage.removeItem('token'); // Remove invalid token
      window.location.href = '/'; // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default API;
