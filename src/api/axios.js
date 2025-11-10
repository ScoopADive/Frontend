// src/api/axios.js
import axios from 'axios';

export const STORAGE_KEYS = {
  ACCESS: 'access_token',
  REFRESH: 'refresh_token',
  EMAIL: 'email',
  NAME: 'name',
  ID: 'id',
};

// 모든 axios 요청에 쿠키를 포함
axios.defaults.withCredentials = true;

// 단일 Axios 인스턴스
const API = axios.create({
  baseURL: 'https://scoopadive.com/api',
  headers: { Accept: 'application/json' },
  withCredentials: true,
});

// base64url 안전 디코딩
function decodeJwtPayload(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    let payload = parts[1];
    payload = payload.replace(/-/g, '+').replace(/_/g, '/');
    const pad = payload.length % 4;
    if (pad) payload += '='.repeat(4 - pad);
    const json = atob(payload);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// 만료 판정 (skewMs 만큼 여유를 두고 만료로 본다)
export function isTokenExpired(token, skewMs = 60000) {
  if (!token) return true;
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== 'number') return true;
  const expMs = payload.exp * 1000;
  return expMs - Date.now() <= skewMs;
}

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
  try {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  } catch {}
  stopProactiveTimer();
  // 탭 간 동기화를 위해 이벤트를 쏜다
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

// 리프레시 중복 방지 및 요청 큐
let isRefreshing = false;
let pendingQueue = [];

// 사전 리프레시 타이머 핸들
let refreshTimerId = null;

// 요청 큐 처리
function processQueue(error, newAccess) {
  pendingQueue.forEach(({ resolve, reject, originalConfig }) => {
    if (error) {
      reject(error);
    } else {
      if (newAccess) {
        originalConfig.headers = originalConfig.headers || {};
        originalConfig.headers['Authorization'] = `Bearer ${newAccess}`;
      }
      resolve(API(originalConfig));
    }
  });
  pendingQueue = [];
}

// 실제 리프레시 호출 (인터셉터 루프 방지 위해 순수 axios 사용)
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
  // 새 액세스 토큰 기준으로 사전 리프레시 타이머 재설정
  scheduleProactiveTimer(access);
  return access;
}

// 사전 리프레시 타이머 설정
function scheduleProactiveTimer(access) {
  stopProactiveTimer();
  if (!access) return;

  const payload = decodeJwtPayload(access);
  if (!payload || typeof payload.exp !== 'number') return;

  const expMs = payload.exp * 1000;
  const lead = 120000; // 만료 2분 전 리프레시
  const delay = Math.max(0, expMs - Date.now() - lead);

  refreshTimerId = window.setTimeout(async () => {
    // 이미 다른 리프레시가 동작 중이면 대기
    if (isRefreshing) return;
    try {
      isRefreshing = true;
      await tryRefreshOnce();
    } catch {
      // 실패 시 세션 정리
      clearSession();
      redirectToSignIn();
    } finally {
      isRefreshing = false;
    }
  }, delay);
}

function stopProactiveTimer() {
  if (refreshTimerId) {
    clearTimeout(refreshTimerId);
    refreshTimerId = null;
  }
}

// 가시성/온라인 이벤트에서 만료 임박 시 즉시 리프레시
function setupWindowEvents() {
  // 탭 재진입 시점
  document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState !== 'visible') return;
    const access = getAccess();
    if (access && isTokenExpired(access, 90000)) {
      if (!isRefreshing) {
        try {
          isRefreshing = true;
          await tryRefreshOnce();
        } catch {
          clearSession();
          redirectToSignIn();
        } finally {
          isRefreshing = false;
        }
      }
    }
  });

  // 오프라인에서 온라인 복귀 시
  window.addEventListener('online', async () => {
    const access = getAccess();
    if (access && isTokenExpired(access, 90000)) {
      if (!isRefreshing) {
        try {
          isRefreshing = true;
          await tryRefreshOnce();
        } catch {
          clearSession();
          redirectToSignIn();
        } finally {
          isRefreshing = false;
        }
      }
    }
  });

  // 탭 간 로그아웃 동기화
  window.addEventListener('storage', (e) => {
    if (e.key === '__logout_broadcast__') {
      stopProactiveTimer();
      // 현재 탭도 즉시 로그인 화면으로
      if (window.location.pathname !== '/signin') {
        window.location.assign('/signin');
      }
    }
  });
}
setupWindowEvents();

// 외부에서 로그인/토큰 갱신 시 세션 등록
export function registerSession({ access, refresh }) {
  if (access) setAccess(access);
  if (refresh) setRefresh(refresh);
  if (access) scheduleProactiveTimer(access);
}

// 요청 인터셉터: Authorization 및 FormData Content-Type 처리
API.interceptors.request.use(
  async (config) => {
    let access = getAccess();

    // 요청 직전 만료 임박 시 즉시 리프레시 시도
    if (access && isTokenExpired(access, 60000)) {
      if (!isRefreshing) {
        try {
          isRefreshing = true;
          access = await tryRefreshOnce();
        } catch {
          // 실패 시 세션 종료
          clearSession();
          redirectToSignIn();
          return Promise.reject(new Error('Access token refresh failed'));
        } finally {
          isRefreshing = false;
        }
      }
    }

    if (access) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${access}`;
    }

    const isFormData = typeof FormData !== 'undefined' && config.data instanceof FormData;
    if (isFormData && config.headers && config.headers['Content-Type']) {
      delete config.headers['Content-Type'];
    } else if (!isFormData) {
      if (config.headers && !config.headers['Content-Type']) {
        config.headers['Content-Type'] = 'application/json';
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 응답 인터셉터: 401 처리 (한 번만 리프레시 시도, 동시요청 큐잉)
API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error?.response?.status;
    const originalConfig = error?.config;

    if (status !== 401 || !originalConfig) {
      return Promise.reject(error);
    }

    if (originalConfig.__handled401) {
      return Promise.reject(error);
    }
    originalConfig.__handled401 = true;

    const access = getAccess();
    const refresh = getRefresh();

    // access가 만료로 보이고 refresh가 있으면 리프레시 시도
    if (access && refresh && isTokenExpired(access, 0)) {
      if (isRefreshing) {
        // 리프레시 중이면 큐에 넣고 대기
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject, originalConfig });
        });
      }

      isRefreshing = true;
      try {
        const newAccess = await tryRefreshOnce();
        isRefreshing = false;
        processQueue(null, newAccess);
        // 원요청 재시도
        originalConfig.headers = originalConfig.headers || {};
        originalConfig.headers['Authorization'] = `Bearer ${newAccess}`;
        return API(originalConfig);
      } catch (refreshErr) {
        isRefreshing = false;
        processQueue(refreshErr, null);
        clearSession();
        redirectToSignIn();
        return Promise.reject(refreshErr);
      }
    }

    // 그 외 401은 즉시 로그아웃 (예: 토큰 없음, 서버 무효화 등)
    clearSession();
    redirectToSignIn();
    return Promise.reject(error);
  },
);

// 앱 시작 시 보유 토큰이 있으면 타이머 세팅
(function bootstrapTimer() {
  try {
    const access = getAccess();
    if (access && !isTokenExpired(access, 60000)) {
      scheduleProactiveTimer(access);
    }
  } catch {}
})();

export default API;
