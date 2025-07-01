import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import authService from "../services/authService";
import useUserStore from "../store/userStore";

const OAuth2RedirectHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const email = params.get("email");
    const name = params.get("name");
    const id = params.get("id"); // id 받아오기

    if (token && email && id) {
      // 토큰 및 유저 정보 저장
      localStorage.setItem("access_token", token);
      localStorage.setItem("email", email);
      localStorage.setItem("name", name);
      localStorage.setItem("id", id); // 추가

      // Zustand에 사용자 정보 반영
      setUser({ id, email, name });

      navigate("/mypage"); // 로그인 후 마이페이지로 이동
    } else {
      alert("로그인 처리에 실패했습니다.");
      navigate("/login");
    }
  }, [location, navigate, setUser]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-blue-600 text-lg">로그인 처리 중입니다...</p>
    </div>
  );
};

export default OAuth2RedirectHandler;
