import axios from 'axios';
import authService from '../services/authService';

// 기본 Content-Type을 강제로 'application/json'으로 고정하면
// FormData 전송이 깨지므로 제거한다.
const api = axios.create({
  baseURL: 'https://scoopadive.com/api/',
  headers: {
    Accept: 'application/json',
  },
});

// 요청 시 access token 자동 첨부 + FormData면 Content-Type 제거
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      if (!config.headers) config.headers = {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // FormData면 Content-Type 헤더를 지워서 브라우저가 boundary를 붙이게 한다.
    const isFormData =
      typeof FormData !== 'undefined' && config.data instanceof FormData;

    if (isFormData) {
      if (config.headers && config.headers['Content-Type']) {
        delete config.headers['Content-Type'];
      }
    } else {
      // JSON 전송일 때만 기본 Content-Type 지정
      if (config.headers && !config.headers['Content-Type']) {
        config.headers['Content-Type'] = 'application/json';
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// 응답에서 401일 경우 → 토큰 갱신 시도 → 원래 요청 재시도
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      !originalRequest?.url?.includes('auths/signin') &&
      !originalRequest?.url?.includes('auths/signup')
    ) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await authService.refreshToken();
        if (newAccessToken) {
          localStorage.setItem('access_token', newAccessToken);
          if (!originalRequest.headers) originalRequest.headers = {};
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

          // 재시도 요청이 FormData라면 Content-Type이 없도록 보장
          const isFormData =
            typeof FormData !== 'undefined' &&
            originalRequest.data instanceof FormData;
          if (isFormData && originalRequest.headers['Content-Type']) {
            delete originalRequest.headers['Content-Type'];
          }

          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('❌ 토큰 갱신 실패:', refreshError);
      }

      try {
        await authService.logout();
      } finally {
        window.location.href = '/';
      }
    }

    return Promise.reject(error);
  },
);

export default api;
