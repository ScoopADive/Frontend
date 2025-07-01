import PropTypes from "prop-types";

// 로그인 여부 상관없이 무조건 children 반환 (임시 우회)
const ProtectedRoute = ({ children }) => {
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node,
};

export default ProtectedRoute;