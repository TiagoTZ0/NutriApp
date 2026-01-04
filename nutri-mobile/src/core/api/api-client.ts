import axios from 'axios';
// Asegúrate de que esta ruta sea correcta hacia tu archivo constants
// Si constants.ts está en src/core/config/constants.ts, la ruta es:
import { API_URL } from '../config/constants';
import { storage } from '../storage/storage';

// 1. Instancia Base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos
});

// Request interceptor
api.interceptors.request.use(async (config) => {
  try {
    // Get auth token from storage
    const token = await storage.getItem('auth_token');

    // Skip token for public endpoints (registration, login)
    const url = config.url || '';
    const method = config.method?.toLowerCase();
    const isPublicPost = (url.includes('users') || url.includes('login')) && method === 'post';

    if (token && !isPublicPost) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (__DEV__) {
      console.log(`Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }

  } catch (error) {
    console.error("Error injecting token:", error);
  }

  return config;
}, (error) => {
  console.error('Request error:', error);
  return Promise.reject(error);
});

// Response interceptor for token expiration handling
api.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      console.log(`Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    }
    return response;
  },
  async (error) => {
    // Error logging
    if (__DEV__) {
      if (error.code === 'ECONNABORTED') {
        console.error('Request timeout (exceeded 10 seconds)');
      } else if (error.message === 'Network Error') {
        console.error('Network error - verify Django is running');
      } else if (error.response) {
        console.error(`API error ${error.response.status}: ${error.config?.url}`);
      } else {
        console.error('Unknown error:', error.message);
      }
    }

    // Clear token if unauthorized (401)
    if (error.response?.status === 401) {
      console.warn('Session expired (401). Clearing storage...');
      await storage.removeItem('auth_token');
    }
    return Promise.reject(error);
  }
);

// Exportación por defecto para que puedas hacer: import api from '...'
export default api;
// Exportación nombrada por si prefieres: import { api } from '...'
export { api };