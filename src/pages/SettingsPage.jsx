import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";

const SettingsPage = () => {
  const [language, setLanguage] = useState("ko");
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState(true);
  const [email] = useState("rim@gmail.com"); // 예시 이메일, 실제로는 로그인한 사용자 정보에서 가져와야 함

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("user_settings"));
    if (saved) {
      setLanguage(saved.language || "ko");
      setTheme(saved.theme || "light");
      setNotifications(saved.notifications || true);
    }
  }, []);

  const handleSave = () => {
    const payload = { language, theme, notifications };
    localStorage.setItem("user_settings", JSON.stringify(payload));
    alert("✅ 설정이 저장되었습니다!");
  };

  const handleDeleteAccount = () => {
    const confirm = window.confirm("정말로 회원 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.");
    if (confirm) {
      alert("탈퇴 처리되었습니다.");
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>

        {/* 계정 이메일 */}
        <div className="bg-white shadow-md rounded-xl p-6 space-y-2">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Account</h2>
          <label className="text-gray-600 text-sm">Email</label>
          <input
            type="text"
            value={email}
            disabled
            className="w-full border rounded p-2 bg-gray-100 text-gray-700"
          />
        </div>

        {/* 비밀번호 변경 */}
        <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Password</h2>

          {/* 기존 비밀번호 입력 */}
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full border p-2 rounded"
          />

          {/* 새 비밀번호 입력 + 안내 문구 */}
          <div>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border p-2 rounded"
            />
            <p className="text-sm text-gray-500 mt-1">
              Password must contain at least one uppercase and lowercase letter, and be at least 6 characters long.
            </p>
          </div>

          {/* 새 비밀번호 재입력 */}
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border p-2 rounded"
          />

          {/* 업데이트 버튼 (조건 충족 시 활성화) */}
          <div className="pt-2">
            <button
              type="button"
              disabled={
                !currentPassword || !newPassword || newPassword !== confirmPassword
              }
              className={`w-full py-2 rounded font-semibold ${
                currentPassword && newPassword && newPassword === confirmPassword
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Update
            </button>
          </div>
        </div>

        {/* 언어 설정 */}
        <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Language</h2>
          <div className="flex items-center justify-between">
            <label className="text-gray-600 font-medium">Interface Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="border p-2 rounded w-40"
            >
              <option value="ko">한국어</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        {/* 테마 설정 */}
        <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Theme</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setTheme("light")}
              className={`flex-1 p-3 rounded text-sm font-medium border ${
                theme === "light"
                  ? "bg-gray-100 border-gray-400"
                  : "bg-white border-gray-200"
              }`}
            >
              ☀️ Light
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`flex-1 p-3 rounded text-sm font-medium border ${
                theme === "dark"
                  ? "bg-gray-800 text-white border-gray-600"
                  : "bg-white border-gray-200"
              }`}
            >
              🌙 Dark
            </button>
          </div>
        </div>

        {/* 알림 설정 */}
        <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Email Notifications</h2>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">Receive Email Alerts</span>
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
        </div>

        {/* 저장 버튼 */}
        <div className="text-right">
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded"
          >
            Save Settings
          </button>
        </div>

        {/* 회원 탈퇴 */}
        <div className="bg-gray-50 border border-red-200 rounded-xl p-6 mt-6">
          <h2 className="text-lg font-semibold text-red-600 mb-2">회원 탈퇴</h2>
          <p className="text-sm text-gray-600 mb-4">
            탈퇴 시 작성하신 게시물 및 댓글은 모두 삭제되며 복구되지 않습니다.
          </p>
          <button
            onClick={handleDeleteAccount}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded"
          >
            회원 탈퇴
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
