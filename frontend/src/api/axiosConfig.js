// src/api/axiosConfig.js
import axios from 'axios';

// Dapatkan URL dasar dari file .env
const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8001/api';

// Buat instance axios kustom
const api = axios.create({
  baseURL: API_URL
});

// Ini adalah 'interceptor' yang akan menempelkan token ke SETIAP request
// jika token itu ada di localStorage.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;