import axios from 'axios';

const api = axios.create({
  baseURL: 'https://orgoback-production.up.railway.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers['Authorization'] = `Token ${token}`;
  }
  return config;
});

export default api;
