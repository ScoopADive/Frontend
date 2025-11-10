// src/api/axios.js
import axios from 'axios';

export const STORAGE_KEYS = {
  ACCESS: 'access_token',
  REFRESH: 'refresh_token',
  EMAIL: 'email',
  NAME: 'name',
  ID: 'id',
};

// 모든 요청에 쿠키 포함
axios.defaults.withCredentials = true;

// 단일 axios 인스턴스 생성
const API = axios.create({
  baseURL: 'https://scoopadive.com/api',
  headers: { Accept: 'application/json' },
  withCredentials: true,
});

// csrftoken 쿠키 가져오기
function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift() || null;
  return null;
}

// JWT payload decode
function decodeJwtPayload(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    let payload = parts[1];
    payload = payload.replace(/-/g, '+').replace(/_/g, '/');
    const pad = payload.length % 4;
    if (pad) payload += '='.repeat(4 - pad);
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

// 토큰 만료 판정
export function isTokenExpired(token, skewMs = 60000) {
  if (!token) return true;
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== 'number') return true;
  return payload.exp * 1000 - Date.now() <= skewMs;
}

// 토큰 관련
export function getAccess() {
  return localStorage.getItem(STORAGE_KEYS.ACCESS);
}
export function getRefresh() {
  return localStorage.getItem(STORAGE_KEYS.REFRESH);
}
function setAccess(access) {
  if (access) localStorage.setItem(STORAGE_KEYS.ACCESS, access);
}
function setRefresh(refresh) {
  if (refresh) localStorage.setItem(STORAGE_KEYS.REFRESH, refresh);
}

export function clearSession() {
  Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  stopProactiveTimer();
  try {
    localStorage.setItem('__logout_broadcast__', String(Date.now()));
  } catch {}
}

function redirectToSignIn() {
  try {
    if (window.location.pathname !== '/signin') {
      window.location.assign('/signin');
    }
  } catch {}
}

// 리프레시 관련 상태
let isRefreshing = false;
let pendingQueue = [];
let refreshTimerId = null;

// 리프레시 로직
async function tryRefreshOnce() {
  const refresh = getRefresh();
  if (!refresh) throw new Error('No refresh token');
  const res = await axios.post(
    'https://scoopadive.com/api/auths/token/refresh/',
    { refresh },
    { withCredentials: true }
  );
  const { access, refresh: newRefresh } = res.data || {};
  if (!access) throw new Error('No access in refresh response');
  setAccess(access);
  if (newRefresh) setRefresh(newRefresh);
  scheduleProactiveTimer(access);
  return access;
}

// 리프레시 타이머 예약
function scheduleProactiveTimer(access) {
  stopProactiveTimer();
  if (!access) return;
  const payload = decodeJwtPayload(access);
  if (!payload || typeof payload.exp !== 'number') return;
  const delay = Math.max(0, payload.exp * 1000 - Date.now() - 120000);
  refreshTimerId = window.setTimeout(async () => {
    if (isRefreshing) return;
    try {
      isRefreshing = true;
      await tryRefreshOnce();
    } catch {
      clearSession();
      redirectToSignIn();
    } finally {
      isRefreshing = false;
    }
  }, delay);
}

function stopProactiveTimer() {
  if (refreshTimerId) clearTimeout(refreshTimerId);
  refreshTimerId = null;
}

export function registerSession({ access, refresh }) {
  if (access) setAccess(access);
  if (refresh) setRefresh(refresh);
  if (access) scheduleProactiveTimer(access);
}

// 요청 인터셉터 (CSRF + JWT)
API.interceptors.request.use(
  async (config) => {
    let access = getAccess();

    if (access && isTokenExpired(access, 60000)) {
      if (!isRefreshing) {
        try {
          isRefreshing = true;
          access = await tryRefreshOnce();
        } catch {
          clearSession();
          redirectToSignIn();
          return Promise.reject(new Error('Token refresh failed'));
        } finally {
          isRefreshing = false;
        }
      }
    }

    if (access) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${access}`;
    }

    // 모든 요청에 쿠키 포함
    config.withCredentials = true;

    // CSRF 헤더 자동 추가 (POST/PUT/PATCH/DELETE)
    const method = (config.method || 'get').toLowerCase();
    const unsafe = ['post', 'put', 'patch', 'delete'];
    if (unsafe.includes(method)) {
      const csrf = getCookie('csrftoken');
      if (csrf) {
        config.headers['X-CSRFToken'] = csrf;
      }
    }

    // multipart/form-data 자동 처리
    const isFormData =
      typeof FormData !== 'undefined' && config.data instanceof FormData;
    if (isFormData && config.headers['Content-Type']) {
      delete config.headers['Content-Type'];
    } else if (!isFormData && !config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터
API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error?.response?.status;
    const originalConfig = error?.config;
    if (status !== 401 || !originalConfig) return Promise.reject(error);
    if (originalConfig.__handled401) return Promise.reject(error);
    originalConfig.__handled401 = true;

    const access = getAccess();
    const refresh = getRefresh();

    if (access && refresh && isTokenExpired(access, 0)) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject, originalConfig });
        });
      }
      isRefreshing = true;
      try {
        const newAccess = await tryRefreshOnce();
        isRefreshing = false;
        pendingQueue.forEach(({ resolve }) =>
          resolve(API(originalConfig))
        );
        pendingQueue = [];
        originalConfig.headers['Authorization'] = `Bearer ${newAccess}`;
        return API(originalConfig);
      } catch (err) {
        isRefreshing = false;
        pendingQueue = [];
        clearSession();
        redirectToSignIn();
        return Promise.reject(err);
      }
    }

    clearSession();
    redirectToSignIn();
    return Promise.reject(error);
  }
);

// 앱 시작 시 타이머 등록
(function bootstrapTimer() {
  try {
    const access = getAccess();
    if (access && !isTokenExpired(access, 60000)) {
      scheduleProactiveTimer(access);
    }
  } catch {}
})();

export default API;
