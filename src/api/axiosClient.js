// src/api/axiosClient.js
// Port of FLC axiosClient — adapted for Artizan admin roles.

import axios from 'axios';

export const BASE_URL = import.meta.env.VITE_API_URL ?? 'https://api.artizan.app';

const axiosClient = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Inject token from localStorage on each request
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('artizan_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401: clear token and redirect to login
axiosClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('artizan_admin_token');
      localStorage.removeItem('artizan_admin_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
