
import axios from 'axios';

// Use absolute URL for development
const API_BASE_URL = 'http://localhost:3001'

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  // Increase timeout to handle slower local backends and DB operations
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpClient.defaults.withCredentials = false;

httpClient.interceptors.request.use(
  (config) => {
    console.log(`${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNREFUSED') {
      console.error('Backend server is not running. Please start the backend server on port 3001.');
    }
    return Promise.reject(error);
  }
);