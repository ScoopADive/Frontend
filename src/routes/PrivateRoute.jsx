import PropTypes from "prop-types"; 

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    return null; // 아무것도 안 보여줌 (리디렉션 없음)
  }

  return children;
};

PrivateRoute.propTypes = {
  children: PropTypes.node,
};

export default PrivateRoute;