import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import LandingPage from "../pages/LandingPage";
import HomePage from "../pages/HomePage";
import SignInPage from "../pages/SignInPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import SignUpPage from "../pages/SignUpPage";
import LogCreatePage from "../pages/LogCreatePage";
import LogDetailPage from "../pages/LogDetailPage";
import MyPage from "../pages/MyPage";
import ChatPage from "../pages/ChatPage";
import ProtectedRoute from "./ProtectedRoute";
import OAuth2RedirectHandler from "../pages/OAuth2RedirectHandler";
import SettingsPage from "../pages/SettingsPage";
import HelpPage from "../pages/HelpPage";
import AllLogsPage from "../pages/AllLogsPage"; 
import { AUTH_ROUTES } from "../constants/routes";

export default function AppRouter() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path={AUTH_ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/help" element={<ProtectedRoute><HelpPage /></ProtectedRoute>} />       
        <Route path="/logs" element={<AllLogsPage />} />
        <Route
          path="/log/new"
          element={
            <ProtectedRoute>
              <LogCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/log/:id"
          element={
            <ProtectedRoute>
              <LogDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mypage"
          element={
            <ProtectedRoute>
              <MyPage isOwnPage={true} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/:username"
          element={
            <ProtectedRoute>
              <MyPage isOwnPage={false} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:username"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}