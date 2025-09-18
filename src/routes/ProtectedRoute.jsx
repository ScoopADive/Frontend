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
