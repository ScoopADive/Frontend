import { create } from 'zustand';

const useUserStore = create((set) => ({
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

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    }),

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),

  // 새로 추가
  updateUser: (updates) =>
    set((state) => ({
      user: { ...state.user, ...updates },
    })),
}));

export default useUserStore;
