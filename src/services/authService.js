import api from '../api/axios';
import {
  signIn as signInAPI,
  signUp,
  requestPasswordReset,
  verifyResetCode,
  confirmNewPassword,
  refreshAccessToken,
} from '../api/auth';

const STORAGE_KEYS = {
  ACCESS: 'access_token',
  REFRESH: 'refresh_token',
  EMAIL: 'email',
  NAME: 'name',
  ID: 'id',
};

function setTokens(access, refresh) {
  if (access) localStorage.setItem(STORAGE_KEYS.ACCESS, access);
  if (refresh) localStorage.setItem(STORAGE_KEYS.REFRESH, refresh);
}
function clearAll() {
  try {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  } catch {}
}

const authService = {
  signin: async (email, password) => {
    const data = await signInAPI(email, password);
    if (data?.error) throw data.error;
    const userName = data.name || data.username || 'User';
    setTokens(data.access, data.refresh);
    if (data.email) localStorage.setItem(STORAGE_KEYS.EMAIL, data.email);
    if (userName) localStorage.setItem(STORAGE_KEYS.NAME, userName);
    if (data.id != null) localStorage.setItem(STORAGE_KEYS.ID, String(data.id));
    return {
      access: data.access,
      refresh: data.refresh,
      email: data.email,
      name: userName,
      id: data.id,
    };
  },

  signup: async ({ email, username, password, country }) => {
    return await signUp({ email, username, password, country });
  },

  loginWithGoogle: async () => {
    // 필요 시 기존 openPopupAndAutoHandle 로직을 여기로 옮겨올 수 있음.
    // 현재 프로젝트에서는 OAuth2RedirectHandler가 토큰을 저장하므로 생략.
    throw new Error('Use OAuth2RedirectHandler for social login');
  },

  refreshToken: async () => {
    const refresh = localStorage.getItem(STORAGE_KEYS.REFRESH);
    if (!refresh) return null;
    const data = await refreshAccessToken(refresh);
    if (data?.error) throw data.error;
    if (data?.access) localStorage.setItem(STORAGE_KEYS.ACCESS, data.access);
    return data?.access || null;
  },

  logout: () => {
    clearAll();
    if (typeof window !== 'undefined' && window.location.pathname !== '/signin') {
      window.location.href = '/signin';
    }
  },

  isAuthenticated: () => !!localStorage.getItem(STORAGE_KEYS.ACCESS),

  getUser: () => ({
    id: localStorage.getItem(STORAGE_KEYS.ID),
    email: localStorage.getItem(STORAGE_KEYS.EMAIL),
    name: localStorage.getItem(STORAGE_KEYS.NAME),
  }),

  requestPasswordReset,
  verifyResetCode,
  confirmNewPassword,
};

export default authService;
