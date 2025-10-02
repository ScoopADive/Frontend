// src/routes/PrivateRoute.jsx
import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";
import { isTokenExpired, STORAGE_KEYS } from "../api/axios";

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const token = typeof window !== "undefined"
    ? localStorage.getItem(STORAGE_KEYS.ACCESS)
    : null;

  if (!token || isTokenExpired(token, 0)) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }
  return children;
};

PrivateRoute.propTypes = {
  children: PropTypes.node,
};

export default PrivateRoute;
