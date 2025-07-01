import { useEffect } from 'react';
import AppRouter from './routes/Router';
import useUserStore from './store/userStore';
import authService from './services/authService';

function App() {
  const setUser = useUserStore((state) => state.setUser);
  const logout = useUserStore((state) => state.logout);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      const user = authService.getUser();
      if (user && user.email) {
        setUser(user);
      } else {
        logout(); // 유저 정보가 이상하면 강제 로그아웃
      }
    } else {
      logout(); // 토큰 없으면 상태 초기화
    }
  }, []);

  return <AppRouter />;
}

export default App;
