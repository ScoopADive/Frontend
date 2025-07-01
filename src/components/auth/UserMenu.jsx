import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../store/userStore";
import authService from "../../services/authService"; 

const UserMenu = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { user } = useUserStore(); 

  const menuRef = useRef(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    if (open) {
      window.addEventListener("click", handleClickOutside);
    }

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [open]);

  const toggleMenu = (e) => {
    e.stopPropagation(); // 메뉴 내부 클릭 시 바깥 클릭 이벤트 막기
    setOpen((prev) => !prev);
  };

  const handleLogout = () => {
    authService.logout(); // 상태 + localStorage 초기화
    navigate("/");
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center"
      >
        {user?.name?.charAt(0)?.toUpperCase() || "U"}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-36 bg-white shadow-md rounded text-sm z-50">
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => {
              setOpen(false);
              navigate("/mypage");
            }}
          >
            마이페이지
          </button>
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => {
              setOpen(false);
              navigate("/settings");
            }}
          >
            설정
          </button>
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => {
              setOpen(false);
              navigate("/help");
            }}
          >
            도움말
          </button>
          <button
            className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
            onClick={handleLogout}
          >
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
