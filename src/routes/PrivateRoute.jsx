// src/routes/PrivateRoute.jsx
// 설명: 프로젝트에 ProtectedRoute가 있으면 이 파일은 쓰지 않아도 된다.
// 만약 사용한다면 ProtectedRoute와 동일한 정책을 유지한다.

import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const token = typeof window !== "undefined"
    ? localStorage.getItem("access_token")
    : null;

  if (!token) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }
  return children;
};

PrivateRoute.propTypes = {
  children: PropTypes.node,
};

export default PrivateRoute;
