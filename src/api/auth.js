import api from './axios';

export const signIn = async (email, password) => {
  try {
    const res = await api.post('auths/signin/', { email, password });
    return res.data;
  } catch (err) {
    return { error: err?.response?.data || 'Sign in failed' };
  }
};

export const signUp = async ({ email, username, password, country }) => {
  try {
    const res = await api.post('auths/signup/', {
      email,
      username,
      password,
      country,
    });
    return res.data;
  } catch (err) {
    return { error: err?.response?.data || 'Sign up failed' };
  }
};

export const refreshAccessToken = async (refreshToken) => {
  try {
    const res = await api.post('auths/token/refresh/', { refresh: refreshToken });
    return res.data;
  } catch (err) {
    return { error: err?.response?.data || 'Token refresh failed' };
  }
};

export const requestPasswordReset = async (email) => {
  try {
    const res = await api.post('password-reset/request/', { email });
    return res.data;
  } catch (err) {
    return { error: err?.response?.data || 'Password reset request failed' };
  }
};

export const verifyResetCode = async (email, code) => {
  try {
    const res = await api.post('password-reset/verify/', { email, code });
    return res.data;
  } catch (err) {
    return { error: err?.response?.data || 'Code verification failed' };
  }
};

export const confirmNewPassword = async (email, newPassword) => {
  try {
    const res = await api.post('password-reset/confirm/', {
      email,
      new_password: newPassword,
    });
    return res.data;
  } catch (err) {
    return { error: err?.response?.data || 'Password change failed' };
  }
};
