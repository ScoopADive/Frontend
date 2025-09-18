import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useUserStore from '../store/userStore';

const STORAGE_KEYS = {
  ACCESS: 'access_token',
  REFRESH: 'refresh_token',
  EMAIL: 'email',
  NAME: 'name',
  ID: 'id',
};

const OAuth2RedirectHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const access = params.get('token') || params.get('access') || params.get('access_token');
    const refresh = params.get('refresh') || params.get('refresh_token');
    const email = params.get('email');
    const name = params.get('name') || params.get('username');
    const id = params.get('id');

    if (access && email && id) {
      try {
        localStorage.setItem(STORAGE_KEYS.ACCESS, access);
        if (refresh) localStorage.setItem(STORAGE_KEYS.REFRESH, refresh);
        localStorage.setItem(STORAGE_KEYS.EMAIL, email);
        if (name) localStorage.setItem(STORAGE_KEYS.NAME, name);
        localStorage.setItem(STORAGE_KEYS.ID, id.toString());
      } catch {}

      setUser({ id: id.toString(), email, name: name || '' });
      navigate('/mypage');
    } else {
      alert('로그인 처리에 실패했습니다.');
      navigate('/signin');
    }
  }, [location, navigate, setUser]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-blue-600 text-lg">로그인 처리 중입니다...</p>
    </div>
  );
};

export default OAuth2RedirectHandler;
