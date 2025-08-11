import api from './axios';

// 로그인
export const signIn = async (email, password) => {
  const res = await api.post('/api/auths/signin/', { email, password });
  return res.data;
};

// 회원가입
export const signUp = async ({ email, username, password, country }) => {
  const res = await api.post('/api/auths/signup/', {
    email,
    username,
    password,
    country,
  });
  return res.data;
};

// access token 갱신
export const refreshAccessToken = async (refreshToken) => {
  const res = await api.post('/api/auths/token/refresh/', {
    refresh: refreshToken,
  });
  return res.data;
};

// 비밀번호 재설정
export const requestPasswordReset = async (email) => {
  const res = await api.post('/api/password-reset/request/', { email });
  return res.data;
};

export const verifyResetCode = async (email, code) => {
  const res = await api.post('/api/password-reset/verify/', { email, code });
  return res.data;
};

export const confirmNewPassword = async (email, newPassword) => {
  const res = await api.post('/api/password-reset/confirm/', {
    email,
    new_password: newPassword,
  });
  return res.data;
};
