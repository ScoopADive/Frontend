import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";

const SettingsPage = () => {
  const [language, setLanguage] = useState("ko");
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  // 기존 설정 불러오기 (localStorage)
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("user_settings"));
    if (saved) {
      setLanguage(saved.language || "ko");
      setDarkMode(saved.darkMode || false);
      setNotifications(saved.notifications || true);
    }
  }, []);

  // 저장
  const handleSave = () => {
    const payload = { language, darkMode, notifications };
    localStorage.setItem("user_settings", JSON.stringify(payload));
    alert("✅ 설정이 저장되었습니다!");
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">⚙️ 설정</h1>

        {/* 언어 설정 */}
        <div className="space-y-1">
          <label className="block font-medium text-gray-700">🌐 언어 설정</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="ko">한국어</option>
            <option value="en">English</option>
          </select>
        </div>

        {/* 테마 설정 */}
        <div className="flex items-center justify-between">
          <span className="text-gray-700 font-medium">🌙 다크모드</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-500 transition" />
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transform peer-checked:translate-x-full transition" />
          </label>
        </div>

        {/* 알림 설정 */}
        <div className="flex items-center justify-between">
          <span className="text-gray-700 font-medium">🔔 이메일 알림 수신</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-500 transition" />
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transform peer-checked:translate-x-full transition" />
          </label>
        </div>

        {/* 저장 버튼 */}
        <div className="pt-4">
          <button
            onClick={handleSave}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold"
          >
            💾 설정 저장
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;

