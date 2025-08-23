// useAuthStore.js
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  loading: true,  // 🔑 NEW

  login: (token) => {
    set({
      accessToken: token,
      isAuthenticated: true,
      loading: false,  // ✅ no longer loading
    });
  },

  logout: () => {
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      loading: false,  // ✅ no longer loading
    });
  },

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),  // 🔑 optional helper
}));
