import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const location = useLocation();

  // 더미 상태: 새 메시지가 있으면 true
  const [hasNewMessage] = useState(true);

  // 현재 언어 상태 ('ko' 또는 'en')
  const [currentLanguage, setCurrentLanguage] = useState("ko");

  // 언어별 링크 텍스트
  const linkTexts = {
    ko: {
      home: "홈",
      addLog: "로그 추가",
      myPage: "내 페이지",
    },
    en: {
      home: "Home",
      addLog: "Add Log",
      myPage: "My Page",
    },
  };

  const links = [
    { key: "home", path: "/home" },
    { key: "addLog", path: "/log/new" },
    { key: "myPage", path: "/mypage" },
  ];

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50 w-full">
      <div className="px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-bold text-blue-600">ScoopADive</h1>
          {hasNewMessage && (
            <span className="text-red-500 text-sm animate-pulse">
              🔔 {currentLanguage === "ko" ? "새 메시지가 도착했습니다" : "New message arrived"}
            </span>
          )}
          <select
            value={currentLanguage}
            onChange={(e) => setCurrentLanguage(e.target.value)}
            className="border rounded p-1 text-sm"
          >
            <option value="ko">🇰🇷 한국어</option>
            <option value="en">🇺🇸 English</option>
          </select>
        </div>
        <ul className="flex space-x-6 text-sm font-medium text-gray-600">
          {links.map((link) => (
            <li key={link.key}>
              <Link
                to={link.path}
                className={`hover:text-blue-500 transition ${
                  location.pathname === link.path ? "text-blue-600 font-semibold" : ""
                }`}
              >
                {linkTexts[currentLanguage][link.key]}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;


