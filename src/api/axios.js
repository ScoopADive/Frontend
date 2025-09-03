import axios from 'axios';

const STORAGE_KEYS = {
  ACCESS: 'access_token',
  REFRESH: 'refresh_token',
  EMAIL: 'email',
  NAME: 'name',
  ID: 'id',
};

function redirectToSignIn() {
  try {
    if (window.location.pathname !== '/signin') {
      window.location.assign('/signin');
    }
  } catch (_) {}
}

export function forceLogout() {
  try {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  } catch (_) {}
  redirectToSignIn();
}

function isTokenExpired(token) {
  if (!token) return true;
  try {
    const [, payload] = token.split('.');
    const decoded = JSON.parse(atob(payload));
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

async function tryRefreshToken() {
  const refresh = localStorage.getItem(STORAGE_KEYS.REFRESH);
  if (!refresh) return null;
  try {
    const res = await axios.post('https://scoopadive.com/api/auths/token/refresh/', { refresh });
    const { access } = res.data;
    if (access) {
      localStorage.setItem(STORAGE_KEYS.ACCESS, access);
      return access;
    }
  } catch {
    forceLogout();
  }
  return null;
}

const api = axios.create({
  baseURL: 'https://scoopadive.com/api/',
  headers: { Accept: 'application/json' },
  withCredentials: false,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS);
    if (token) {
      if (!config.headers) config.headers = {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    const isFormData = typeof FormData !== 'undefined' && config.data instanceof FormData;
    if (isFormData) {
      if (config.headers && config.headers['Content-Type']) {
        delete config.headers['Content-Type'];
      }
    } else {
      if (config.headers && !config.headers['Content-Type']) {
        config.headers['Content-Type'] = 'application/json';
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;
    if (originalRequest && originalRequest.__handled401) {
      return Promise.reject(error);
    }
    if (status === 401) {
      if (originalRequest) originalRequest.__handled401 = true;
      const access = localStorage.getItem(STORAGE_KEYS.ACCESS);
      const refresh = localStorage.getItem(STORAGE_KEYS.REFRESH);
      if (access && refresh && isTokenExpired(access)) {
        const newAccess = await tryRefreshToken();
        if (newAccess) {
          originalRequest.headers['Authorization'] = `Bearer ${newAccess}`;
          return api(originalRequest);
        }
        forceLogout();
        return Promise.reject(error);
      } else {
        forceLogout();
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
