// src/api/axios.js
import axios from 'axios';

export const STORAGE_KEYS = {
  ACCESS: 'access_token',
  REFRESH: 'refresh_token',
  EMAIL: 'email',
  NAME: 'name',
  ID: 'id',
};

axios.defaults.withCredentials = true;

const API = axios.create({
  baseURL: 'https://scoopadive.com/api',
  headers: { Accept: 'application/json' },
  withCredentials: true,
});

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

let isRefreshing = false;
let pendingQueue = [];

let refreshTimerId = null;

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

function scheduleProactiveTimer(access) {
  stopProactiveTimer();
  if (!access) return;

  const payload = decodeJwtPayload(access);
  if (!payload || typeof payload.exp !== 'number') return;

  const expMs = payload.exp * 1000;
  const lead = 120000;
  const delay = Math.max(0, expMs - Date.now() - lead);

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
  if (refreshTimerId) {
    clearTimeout(refreshTimerId);
    refreshTimerId = null;
  }
}

function setupWindowEvents() {
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

  window.addEventListener('storage', (e) => {
    if (e.key === '__logout_broadcast__') {
      stopProactiveTimer();
      if (window.location.pathname !== '/signin') {
        window.location.assign('/signin');
      }
    }
  });
}
setupWindowEvents();

export function registerSession({ access, refresh }) {
  if (access) setAccess(access);
  if (refresh) setRefresh(refresh);
  if (access) scheduleProactiveTimer(access);
}

function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift() || null;
  return null;
}

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

    config.withCredentials = true;

    if (typeof document !== 'undefined') {
      const method = (config.method || 'get').toLowerCase();
      const unsafe = ['post', 'put', 'patch', 'delete'];
      if (unsafe.includes(method)) {
        const csrfToken = getCookie('csrftoken');
        if (csrfToken) {
          config.headers = config.headers || {};
          config.headers['X-CSRFToken'] = csrfToken;
        }
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

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
        processQueue(null, newAccess);
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

    clearSession();
    redirectToSignIn();
    return Promise.reject(error);
  },
);

(function bootstrapTimer() {
  try {
    const access = getAccess();
    if (access && !isTokenExpired(access, 60000)) {
      scheduleProactiveTimer(access);
    }
  } catch {}
})();

export default API;
