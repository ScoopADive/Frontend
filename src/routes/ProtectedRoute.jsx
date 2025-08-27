// src/routes/ProtectedRoute.jsx
// 설명: 인증 보호 라우트. 토큰 없으면 /signin으로 차단.
// axios에서 401 즉시 로그아웃을 수행하므로, 라우팅 수준에서는 선제 차단만 담당.

import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = typeof window !== "undefined"
    ? localStorage.getItem("access_token")
    : null;

  if (!token) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node,
};

export default ProtectedRoute;
