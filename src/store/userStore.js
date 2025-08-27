// src/store/userStore.js
// 설명: 사용자 세션 저장소. setSession, logout 제공.

import { create } from 'zustand';

const STORAGE_KEYS = {
  ACCESS: 'access_token',
  REFRESH: 'refresh_token',
  EMAIL: 'email',
  NAME: 'name',
  ID: 'id',
};

const useUserStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      loading: false,
      error: null,
    }),

  setSession: ({ access, refresh, user }) => {
    if (access) localStorage.setItem(STORAGE_KEYS.ACCESS, access);
    if (refresh) localStorage.setItem(STORAGE_KEYS.REFRESH, refresh);
    if (user?.email) localStorage.setItem(STORAGE_KEYS.EMAIL, user.email);
    if (user?.username || user?.name) {
      localStorage.setItem(STORAGE_KEYS.NAME, user.username || user.name);
    }
    if (user?.id != null) {
      localStorage.setItem(STORAGE_KEYS.ID, String(user.id));
    }
    set({ user: user || null, isAuthenticated: !!user });
  },

  logout: () => {
    try {
      Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    } catch (_) {
      // noop
    }
    set({ user: null, isAuthenticated: false, loading: false, error: null });
  },

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),

  updateUser: (updates) =>
    set((state) => ({
      user: { ...state.user, ...updates },
    })),
}));

export default useUserStore;
