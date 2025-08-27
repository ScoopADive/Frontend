// src/api/axios.js
// 설명: 공통 axios 인스턴스. 401(만료 포함) 발생 시 즉시 강제 로그아웃으로 통일.
// 주의: FormData 전송 시 Content-Type을 수동 지정하지 않는다.

import axios from 'axios';

// 스토리지 키는 전역에서 통일
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

// 응답 인터셉터: 401 즉시 로그아웃으로 통일하여 루프 차단
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 중복 처리 방지 플래그
    if (originalRequest && originalRequest.__handled401) {
      return Promise.reject(error);
    }

    const status = error?.response?.status;
    if (status === 401) {
      if (originalRequest) originalRequest.__handled401 = true;

      // 갱신 시도 없이 즉시 강제 로그아웃
      forceLogout();

      // 상위 호출부로 에러 전파
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

export default api;
