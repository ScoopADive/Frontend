import api from '../api/axios';
import {
  signIn as signInAPI,
  signUp,
  requestPasswordReset,
  verifyResetCode,
  confirmNewPassword,
  refreshAccessToken,
} from '../api/auth';
import useUserStore from '../store/userStore';

// 상수화된 스토리지 키
const STORAGE_KEYS = {
  ACCESS: 'access_token',
  REFRESH: 'refresh_token',
  EMAIL: 'email',
  NAME: 'name',
  ID: 'id',
};

const API_URL = 'https://scoopadive.com';

const authService = {
  googleLogin: () => {
    window.location.href = `${API_URL}/api/accounts/google/login/`;
  },

  signin: async (email, password) => {
    try {
      console.log('📥 로그인 요청 시작');
      const data = await signInAPI(email, password);
      console.log('🔐 로그인 응답 data:', data);

      const userName = data.name || data.username || '사용자';

      // 로컬스토리지 저장
      localStorage.setItem(STORAGE_KEYS.ACCESS, data.access);
      localStorage.setItem(STORAGE_KEYS.REFRESH, data.refresh);
      localStorage.setItem(STORAGE_KEYS.EMAIL, data.email);
      localStorage.setItem(STORAGE_KEYS.NAME, userName);
      localStorage.setItem(STORAGE_KEYS.ID, data.id);

      // Zustand에 넘길 사용자 객체 반환
      return {
        access: data.access,
        refresh: data.refresh,
        email: data.email,
        name: userName,
        id: data.id,
      };
    } catch (error) {
      console.error('❌ 로그인 실패:', error);
      throw error;
    }
  },

  signup: async ({ email, username, password, country }) => {
    return await signUp({ email, username, password, country });
  },

  logout: () => {
    // localStorage 정리
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));

    // 상태 초기화
    const logoutFromStore = useUserStore.getState().logout;
    logoutFromStore();
  },

  isAuthenticated: () => !!localStorage.getItem(STORAGE_KEYS.ACCESS),

  getUser: () => ({
    id: localStorage.getItem(STORAGE_KEYS.ID),
    email: localStorage.getItem(STORAGE_KEYS.EMAIL),
    name: localStorage.getItem(STORAGE_KEYS.NAME),
  }),

  refreshToken: async () => {
    const refresh = localStorage.getItem(STORAGE_KEYS.REFRESH);
    if (!refresh) return null;

    try {
      const data = await refreshAccessToken(refresh);
      localStorage.setItem(STORAGE_KEYS.ACCESS, data.access);
      return data.access;
    } catch (err) {
      console.error('❌ 토큰 갱신 실패:', err);
      authService.logout();
      return null;
    }
  },

  requestPasswordReset,
  verifyResetCode,
  confirmNewPassword,
};

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      authService.logout();
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  },
);

export default authService;
