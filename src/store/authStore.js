// src/store/authStore.js
// Port of FLC authStore — adapted for Artizan admin roles.
// Roles: super_admin | community_admin | community_security

import { create } from 'zustand';
import axiosClient from '../api/axiosClient';

const STORAGE_TOKEN = 'artizan_admin_token';
const STORAGE_USER  = 'artizan_admin_user';

const useAuthStore = create((set) => ({
  user:  JSON.parse(localStorage.getItem(STORAGE_USER) ?? 'null'),
  token: localStorage.getItem(STORAGE_TOKEN),
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      // Try super admin first, then community admin
      let res;
      try {
        res = await axiosClient.post('/auth/admin/login', { email, password });
      } catch {
        res = await axiosClient.post('/auth/community/login', { email, password });
      }
      const { token, user } = res.data.data;
      localStorage.setItem(STORAGE_TOKEN, token);
      localStorage.setItem(STORAGE_USER, JSON.stringify(user));
      axiosClient.defaults.headers.common.Authorization = `Bearer ${token}`;
      set({ user, token, loading: false });
      return { success: true, role: user.role };
    } catch (err) {
      const message = err.response?.data?.error?.message ?? 'Login failed.';
      set({ loading: false, error: message });
      return { success: false, error: message };
    }
  },

  logout: () => {
    localStorage.removeItem(STORAGE_TOKEN);
    localStorage.removeItem(STORAGE_USER);
    delete axiosClient.defaults.headers.common.Authorization;
    set({ user: null, token: null });
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
