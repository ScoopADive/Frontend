import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import LandingPage from "../pages/LandingPage";
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import SignUpPage from '../pages/SignUpPage';
import LogCreatePage from '../pages/LogCreatePage';
import LogDetailPage from '../pages/LogDetailPage';
import MyPage from '../pages/MyPage';
import ChatPage from '../pages/ChatPage';

export default function AppRouter() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/log/new" element={<LogCreatePage />} />
        <Route path="/log/:id" element={<LogDetailPage />} />
        
        {/* 본인 마이페이지 */}
        <Route path="/mypage" element={<MyPage isOwnPage={true} />} />
        
        {/* 친구 마이페이지 (username param 포함) */}
        <Route path="/user/:username" element={<MyPage isOwnPage={false} />} />

        {/* 채팅 */}
        <Route path="/chat/:username" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}
