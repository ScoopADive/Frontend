// src/pages/SignInPage.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import authService from '../services/authService';
import useUserStore from '../store/userStore';
import { handleFormChange, getErrorMessage } from '../utils/formUtil';
import { AUTH_ROUTES, AUTH_LABELS } from '../constants';
import { fetchMyPreferences } from '../api/preferences'; // 🔹 설문 조회

// 유저별 설문 스킵 키 생성
function getSurveySkipKey(userId) {
  return userId ? `survey_never_show_${userId}` : 'survey_never_show';
}

function SignInPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    setError('');

    try {
      const data = await authService.signin(form.email, form.password);

      // 로그인 성공 후 기본 정보 저장
      localStorage.setItem('email', data.email);
      localStorage.setItem('name', data.name);
      localStorage.setItem('id', String(data.id));
      setUser({ id: data.id, email: data.email, name: data.name });

      // 🔹 로그인 후 설문/플래그 확인
      let prefs = null;
      try {
        prefs = await fetchMyPreferences();
      } catch (err) {
        console.error('failed to load preferences after login', err);
      }

      let neverShow = false;
      try {
        const skipKey = getSurveySkipKey(data.id);
        neverShow = localStorage.getItem(skipKey) === '1';
      } catch (err) {
        console.error('failed to read survey_never_show', err);
      }

      // 1) 설문 객체가 없고
      // 2) 이 계정에 대해 "다시 보지 않기"도 안 눌렀으면 → 설문 페이지로
      if (!prefs && !neverShow) {
        navigate('/settings/preferences', { replace: true });
      } else {
        // 그 외에는 원래 홈으로
        navigate(AUTH_ROUTES.HOME);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    if (googleLoading) return;
    setGoogleLoading(true);
    setError('');
    window.location.href =
      'https://scoopadive.com/api/accounts/google/login/';
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded-xl shadow-md space-y-4">
        <h1 className="text-2xl font-bold text-center text-blue-600">
          {AUTH_LABELS.SIGN_IN}
        </h1>

        <Input
          label={AUTH_LABELS.EMAIL}
          name="email"
          value={form.email}
          onChange={handleFormChange(setForm)}
        />
        <Input
          label={AUTH_LABELS.PASSWORD}
          name="password"
          type="password"
          value={form.password}
          onChange={handleFormChange(setForm)}
        />

        <Button
          text={loading ? 'Signing In...' : AUTH_LABELS.SIGN_IN}
          onClick={handleSubmit}
          disabled={loading || googleLoading}
        />

        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        <button
          onClick={handleGoogleLogin}
          className="w-full py-2 px-4 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition disabled:opacity-60"
          disabled={googleLoading || loading}
        >
          {googleLoading
            ? 'Signing in with Google...'
            : AUTH_LABELS.CONTINUE_WITH_GOOGLE}
        </button>

        <div className="text-sm text-center text-gray-500">
          비밀번호를 잊으셨나요?{' '}
          <Link
            to="/forgot-password"
            className="text-blue-600 hover:underline"
          >
            비밀번호 재설정
          </Link>
        </div>

        <div className="text-center text-sm text-gray-600 mt-4">
          아직 계정이 없으신가요?{' '}
          <Link
            to="/signup"
            className="text-blue-600 hover:text-blue-700 font-semibold"
            style={{ textDecoration: 'none' }}
          >
            회원가입
          </Link>
        </div>
      </div>
    </Layout>
  );
}

export default SignInPage;
