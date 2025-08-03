import { useLocation, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import useUserStore from "../../store/userStore";
import UserMenu from "../auth/UserMenu";
import { Search, PlusCircle, Bell } from "lucide-react";

function Navbar() {
  const location = useLocation();
  const { user } = useUserStore();
  const isAuthPage = location.pathname === "/signin" || location.pathname === "/signup";
  const [hasNewMessage] = useState(true);

  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef(null); // 검색창 바깥 클릭 감지용

  const toggleSearch = (e) => {
    e.stopPropagation(); // 내부 클릭은 바깥으로 퍼지지 않게
    setShowSearch((prev) => !prev);
  };

  // 검색창 외부 클릭 시 닫힘
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
      }
    };

    if (showSearch) {
      window.addEventListener("click", handleClickOutside);
    }

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [showSearch]);

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50 w-full">
      <div className="px-6 py-3 flex items-center justify-between">
        {/* 왼쪽: 로고 */}
        <div className="flex items-center space-x-4">
          <Link to="/home" className="text-lg font-bold text-blue-600 hover:no-underline">
            ScoopADive
          </Link>
        </div>

        {/* 오른쪽 메뉴 */}
        {user ? (
          <ul className="flex items-center space-x-6 text-gray-600">
            {/* 검색 */}
            <li className="flex items-center justify-center relative" ref={searchRef}>
              <button onClick={toggleSearch} className="hover:text-blue-500 transition">
                <Search size={20} />
              </button>
              {showSearch && (
                <div className="absolute top-8 right-0 mt-2 bg-white border border-gray-300 rounded shadow-md p-2 z-50">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="px-2 py-1 w-48 border border-gray-300 rounded focus:outline-none focus:ring"
                  />
                </div>
              )}
            </li>

            {/* 로그 작성 버튼 */}
            <li className="relative group flex items-center justify-center">
              <Link to="/log/new" className="hover:text-blue-500 transition">
                <PlusCircle size={20} />
              </Link>
              <span className="absolute left-1/2 top-6 -translate-x-1/2 whitespace-nowrap text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Add Log
              </span>
            </li>

            {/* 알림 */}
            <li className="flex items-center justify-center relative">
              <button className="hover:text-blue-500 transition relative">
                <Bell size={20} />
                {hasNewMessage && !isAuthPage && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white" />
                )}
              </button>
            </li>

            {/* 유저 메뉴 */}
            <li className="flex items-center justify-center">
              <UserMenu />
            </li>
          </ul>
        ) : (
          <ul className="flex items-center space-x-6 text-sm font-medium text-gray-600">
            <li>
              <Link
                to="/signin"
                className={`hover:text-blue-500 transition ${
                  location.pathname === "/signin" ? "text-blue-600 font-semibold" : ""
                }`}
              >
                Sign In
              </Link>
            </li>
            <li>
              <Link
                to="/signup"
                className={`hover:text-blue-500 transition ${
                  location.pathname === "/signup" ? "text-blue-600 font-semibold" : ""
                }`}
              >
                Sign Up
              </Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
