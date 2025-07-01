import { create } from "zustand";

const useLogbookStore = create((set) => ({
  logs: [],
  loading: false,
  error: null,

  setLogs: (logs) => set({ logs, loading: false, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) =>
    set({ error: error?.message || error || "알 수 없는 오류", loading: false }),

  // 로그 하나 추가
  addLog: (log) => set((state) => ({ logs: [log, ...state.logs] })),

  // 로그 전체 제거
  clearLogs: () => set({ logs: [], loading: false, error: null }),

  // 상태 초기화
  reset: () => set({ logs: [], loading: false, error: null }),
}));

export default useLogbookStore;

