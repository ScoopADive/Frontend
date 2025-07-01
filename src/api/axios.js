import axios from "axios";
import authService from "../services/authService"; // 자동 갱신을 위해 추가

const api = axios.create({
  baseURL: "http://13.125.160.47",
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 시 access token 자동 첨부
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답에서 401일 경우 → 토큰 갱신 시도 → 원래 요청 재시도
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 조건: 401 + retry 한 적 없는 요청만
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auths/signin") &&
      !originalRequest.url.includes("/auths/signup")
    ) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await authService.refreshToken(); // 갱신 시도
        if (newAccessToken) {
          // 새 토큰으로 Authorization 헤더 교체
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return api(originalRequest); // 요청 재시도
        }
      } catch (refreshError) {
        console.error("❌ 토큰 갱신 실패:", refreshError);
      }

      // refresh도 실패하면 로그아웃
      authService.logout();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
