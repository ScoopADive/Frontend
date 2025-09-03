import axios from 'axios';

const STORAGE_KEYS = {
  ACCESS: 'access_token',
  REFRESH: 'refresh_token',
  EMAIL: 'email',
  NAME: 'name',
  ID: 'id',
};

// 라우터 훅을 쓸 수 없으므로 하드 리다이렉트 사용
function redirectToSignIn() {
  try {
    if (window.location.pathname !== '/signin') {
      window.location.assign('/signin');
    }
  } catch (_) {
    // noop
  }
}

// 전역 강제 로그아웃: 스토리지 정리 후 /signin 이동
export function forceLogout() {
  try {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  } catch (_) {
    // noop
  }
  redirectToSignIn();
}

// JWT 만료 체크 함수
function isTokenExpired(token) {
  if (!token) return true;
  try {
    const [, payload] = token.split(".");
    const decoded = JSON.parse(atob(payload));
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

// access token 갱신 함수
async function tryRefreshToken() {
  const refresh = localStorage.getItem(STORAGE_KEYS.REFRESH);
  if (!refresh) return null;
  try {
    const res = await axios.post(
      'https://scoopadive.com/api/auths/token/refresh/',
      { refresh }
    );
    const { access } = res.data;
    if (access) {
      localStorage.setItem(STORAGE_KEYS.ACCESS, access);
      return access;
    }
  } catch {
    // refresh 만료 시
    forceLogout();
  }
  return null;
}

const api = axios.create({
  baseURL: 'https://scoopadive.com/api/',
  headers: {
    Accept: 'application/json',
  },
  withCredentials: false,
});

// 요청 인터셉터: 액세스 토큰 자동 첨부, FormData면 Content-Type 제거
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS);
    if (token) {
      if (!config.headers) config.headers = {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    const isFormData =
      typeof FormData !== 'undefined' && config.data instanceof FormData;

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
  (error) => Promise.reject(error),
);

// 응답 인터셉터: 401 발생 시 access token 자동 갱신 후 재시도, refresh 만료 시 강제 로그아웃
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;

    // 중복 처리 방지 플래그
    if (originalRequest && originalRequest.__handled401) {
      return Promise.reject(error);
    }

    // access token 만료로 인한 401
    if (status === 401) {
      if (originalRequest) originalRequest.__handled401 = true;

      // access token 만료 체크
      const access = localStorage.getItem(STORAGE_KEYS.ACCESS);
      const refresh = localStorage.getItem(STORAGE_KEYS.REFRESH);

      if (access && refresh && isTokenExpired(access)) {
        const newAccess = await tryRefreshToken();
        if (newAccess) {
          // 토큰 갱신 성공 시 재시도
          originalRequest.headers['Authorization'] = `Bearer ${newAccess}`;
          return api(originalRequest);
        }
        // refresh도 만료 시 강제 로그아웃
        forceLogout();
        return Promise.reject(error);
      } else {
        // 기타 401은 강제 로그아웃
        forceLogout();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

export default api;