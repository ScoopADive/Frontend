// src/store/userStore.js
import { create } from 'zustand';
import { STORAGE_KEYS, registerSession, clearSession } from '../api/axios';

const useUserStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  hydrate: () => {
    const id = localStorage.getItem(STORAGE_KEYS.ID);
    const email = localStorage.getItem(STORAGE_KEYS.EMAIL);
    const name = localStorage.getItem(STORAGE_KEYS.NAME);
    const access = localStorage.getItem(STORAGE_KEYS.ACCESS);
    const refresh = localStorage.getItem(STORAGE_KEYS.REFRESH);
    const isAuthed = Boolean(access && refresh);
    // 앱을 새로 열었을 때도 사전 리프레시 타이머 세팅
    if (isAuthed) registerSession({ access, refresh });
    set({
      user: isAuthed ? { id, email, name } : null,
      isAuthenticated: isAuthed,
    });
  },

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
    // 세션 타이머 등록
    registerSession({ access, refresh });
    set({ user: user || null, isAuthenticated: !!user });
  },

  logout: () => {
    try {
      Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    } catch {}
    clearSession(); // 타이머 정지 및 탭 동기화
    set({ user: null, isAuthenticated: false, loading: false, error: null });
  },

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),

  updateUser: (updates) =>
    set((state) => ({
      user: { ...(state.user || {}), ...updates },
    })),
}));

export default useUserStore;
