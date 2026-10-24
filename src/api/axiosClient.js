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

// On a dead/invalid token: clear it and redirect to login. Only treat a 401
// as "session expired" when the backend's JWT-verification middleware
// produced it (error.code === 'UNAUTHORIZED') - a handful of legitimate
// business-logic errors reuse the 401 status for other things (e.g. wrong
// current password on change-password is INVALID_PASSWORD, wrong login
// credentials is INVALID_CREDENTIALS), and those must NOT force a logout -
// they're rejected as-is for the caller's own error handling to show.
// Same bug, same fix already applied in artizan-app's apiClient.ts.
axiosClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && error.response?.data?.error?.code === 'UNAUTHORIZED') {
      localStorage.removeItem('artizan_admin_token');
      localStorage.removeItem('artizan_admin_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
