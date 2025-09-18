import axios from 'axios';

const STORAGE_KEYS = {
  ACCESS: 'access_token',
  REFRESH: 'refresh_token',
};

const API = axios.create({
  baseURL: 'https://scoopadive.com/api/',
  headers: { Accept: 'application/json' },
  withCredentials: false,
});

// base64url 안전 디코딩 함수
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

function isTokenExpired(token, skewMs = 30000) {
  if (!token) return true;
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== 'number') return true;
  const expMs = payload.exp * 1000;
  return expMs - Date.now() <= skewMs;
}

function getAccess() {
  return localStorage.getItem(STORAGE_KEYS.ACCESS);
}
function getRefresh() {
  return localStorage.getItem(STORAGE_KEYS.REFRESH);
}
function setAccess(access) {
  if (access) localStorage.setItem(STORAGE_KEYS.ACCESS, access);
}
function clearAll() {
  try {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
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

const processQueue = (error, newAccess) => {
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
};

async function tryRefreshOnce() {
  const refresh = getRefresh();
  if (!refresh) throw new Error('No refresh token');
  // 절대 기본 API 인스턴스를 사용하지 말고, 순수 axios로 호출해야 인터셉터 루프를 피함
  const res = await axios.post('https://scoopadive.com/api/auths/token/refresh/', { refresh });
  const { access } = res.data || {};
  if (!access) throw new Error('No access in refresh response');
  setAccess(access);
  return access;
}

// 요청 인터셉터: Authorization 및 FormData Content-Type 처리
API.interceptors.request.use(
  (config) => {
    const access = getAccess();
    if (access) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${access}`;
    }
    const isFormData =
      typeof FormData !== 'undefined' && config.data instanceof FormData;
    if (isFormData && config.headers && config.headers['Content-Type']) {
      delete config.headers['Content-Type'];
    } else if (!isFormData) {
      if (config.headers && !config.headers['Content-Type']) {
        config.headers['Content-Type'] = 'application/json';
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 401 처리 (한 번만 리프레시 시도, 동시요청 큐잉)
API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error?.response?.status;
    const originalConfig = error.config;

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
    if (access && refresh && isTokenExpired(access)) {
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
        clearAll();
        redirectToSignIn();
        return Promise.reject(refreshErr);
      }
    }

    // 그 외 401은 즉시 로그아웃 (예: 토큰 없음, 서버가 토큰 무효화 등)
    clearAll();
    redirectToSignIn();
    return Promise.reject(error);
  }
);

export default API;
