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

const API_ORIGIN = 'https://scoopadive.com';
const CALLBACK_PATH = '/api/accounts/google/callback/';

function setTokens(access, refresh) {
  if (access) localStorage.setItem(STORAGE_KEYS.ACCESS, access);
  if (refresh) localStorage.setItem(STORAGE_KEYS.REFRESH, refresh);
}

function clearAll() {
  Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
}

function isSameOrigin(url) {
  try {
    const u = new URL(url);
    return u.origin === window.location.origin;
  } catch {
    return false;
  }
}

async function openPopupAndAutoHandle() {
  const { data } = await api.get('/accounts/google/login/');
  const authUrl = data?.auth_url;
  if (!authUrl) throw new Error('No auth_url');

  const popup = window.open(authUrl, 'google_oauth', 'width=500,height=700,noopener');
  if (!popup) throw new Error('Popup blocked');

  const TIMEOUT_MS = 120000;
  const start = Date.now();

  return new Promise((resolve, reject) => {
    let resolved = false;

    function finish(value) {
      if (resolved) return;
      resolved = true;
      window.removeEventListener('message', onMessage);
      try { popup.close(); } catch {}
      resolve(value);
    }

    function onMessage(e) {
      if (e.origin !== API_ORIGIN) return;
      const d = e.data || {};
      if (d && (d.token || d.access || (d.user && d.user.email))) finish(d);
    }

    window.addEventListener('message', onMessage);

    const poll = setInterval(async () => {
      try {
        if (!popup || popup.closed) {
          clearInterval(poll);
          if (!resolved) reject(new Error('Popup closed'));
          return;
        }

        let href = '';
        try {
          href = popup.location.href || '';
        } catch {}

        if (href && href.startsWith(`${API_ORIGIN}${CALLBACK_PATH}`)) {
          if (isSameOrigin(href)) {
            try {
              const res = await fetch(href, { credentials: 'include' });
              const json = await res.json();
              clearInterval(poll);
              finish(json);
              return;
            } catch {}
          }
        }
      } catch {}

      if (Date.now() - start > TIMEOUT_MS) {
        clearInterval(poll);
        window.removeEventListener('message', onMessage);
        try { popup.close(); } catch {}
        if (!resolved) reject(new Error('OAuth timeout'));
      }
    }, 250);
  });
}

const authService = {
  loginWithGoogle: async () => {
    const data = await openPopupAndAutoHandle();
    const access = data?.token?.access_token || data?.access || '';
    const refresh = data?.token?.refresh_token || data?.refresh || '';
    const email = data?.user?.email || '';
    const name = data?.user?.username || data?.user?.name || '';
    const id = (data?.user?.id ?? '').toString();

    setTokens(access, refresh);
    if (email) localStorage.setItem(STORAGE_KEYS.EMAIL, email);
    if (name) localStorage.setItem(STORAGE_KEYS.NAME, name);
    if (id) localStorage.setItem(STORAGE_KEYS.ID, id);

    return { access, refresh, email, name, id };
  },

  signin: async (email, password) => {
    const data = await signInAPI(email, password);
    const userName = data.name || data.username || 'User';
    setTokens(data.access, data.refresh);
    localStorage.setItem(STORAGE_KEYS.EMAIL, data.email);
    localStorage.setItem(STORAGE_KEYS.NAME, userName);
    localStorage.setItem(STORAGE_KEYS.ID, data.id);
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

  logout: () => {
    clearAll();
    if (window.location.pathname !== '/signin') {
      window.location.href = '/signin';
    }
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
      setTokens(data.access, null);
      return data.access;
    } catch {
      authService.logout();
      return null;
    }
  },

  requestPasswordReset,
  verifyResetCode,
  confirmNewPassword,
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS);
    if (token) {
      if (!config.headers) config.headers = {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      authService.logout();
    }
    return Promise.reject(error);
  },
);

export default authService;
