// src/services/authService.js
import api from '../api/axios';
import {
  signIn as signInAPI,
  signUp,
  requestPasswordReset,
  verifyResetCode,
  confirmNewPassword,
  refreshAccessToken,
} from '../api/auth';

import {
  STORAGE_KEYS,
  registerSession,
  clearSession,
} from '../api/axios';

function setTokens(access, refresh) {
  if (access) localStorage.setItem(STORAGE_KEYS.ACCESS, access);
  if (refresh) localStorage.setItem(STORAGE_KEYS.REFRESH, refresh);
}
function clearAllLocal() {
  try {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  } catch {}
}

const authService = {
  signin: async (email, password) => {
    const data = await signInAPI(email, password);
    if (data?.error) throw data.error;

    const userName = data.name || data.username || 'User';

    // 토큰 저장 및 사전 리프레시 등록
    setTokens(data.access, data.refresh);
    registerSession({ access: data.access, refresh: data.refresh });

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
    // OAuth2RedirectHandler가 토큰을 저장하므로 여기서는 사용하지 않는다
    throw new Error('Use OAuth2RedirectHandler for social login');
  },

  refreshToken: async () => {
    const refresh = localStorage.getItem(STORAGE_KEYS.REFRESH);
    if (!refresh) return null;
    const data = await refreshAccessToken(refresh);
    if (data?.error) throw data.error;
    if (data?.access) {
      localStorage.setItem(STORAGE_KEYS.ACCESS, data.access);
      // 세션 타이머 업데이트
      registerSession({ access: data.access, refresh: null });
    }
    return data?.access || null;
  },

  logout: () => {
    clearSession();        // 타이머 정지 + 탭 동기화 브로드캐스트 포함
    clearAllLocal();       // 로컬 저장 정리 (중복 안전)
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
