// src/components/auth/UserMenu.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../store/userStore";
import authService from "../../services/authService";

const UserMenu = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { user } = useUserStore();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [open]);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setOpen((prev) => !prev);
  };

  const handleLogout = () => {
    authService.logout();
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
        <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded text-sm z-50">
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => {
              setOpen(false);
              navigate("/mypage");
            }}
          >
            My Page
          </button>
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => {
              setOpen(false);
              navigate("/settings");
            }}
          >
            Settings
          </button>
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => {
              setOpen(false);
              navigate("/help");
            }}
          >
            Help
          </button>
          <button
            className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
            onClick={handleLogout}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
