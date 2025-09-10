import { useLocation, Link } from "react-router-dom";
import { useEffect, useRef, useState, useCallback } from "react";
import useUserStore from "../../store/userStore";
import UserMenu from "../auth/UserMenu";
import { Search, PlusCircle, Bell } from "lucide-react";
import UserSearchModal from "../search/UserSearchModal";
import NotificationCenter from "../notifications/NotificationCenter";
import MessageComposer from "../messages/MessageComposer";

function Navbar() {
  const location = useLocation();
  const { user } = useUserStore();
  const isAuthPage = location.pathname === "/signin" || location.pathname === "/signup";

  const [showSearchInput, setShowSearchInput] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef(null);

  const [openNotifications, setOpenNotifications] = useState(false);
  const [hasNew, setHasNew] = useState(false);

  const [composerOpen, setComposerOpen] = useState(false);
  const [composerReceiver, setComposerReceiver] = useState(null);

  const toggleSearchInput = (e) => {
    e.stopPropagation();
    setShowSearchInput((prev) => !prev);
  };

  useEffect(() => {
    const onOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchInput(false);
      }
    };
    if (showSearchInput) window.addEventListener("click", onOutside);
    return () => window.removeEventListener("click", onOutside);
  }, [showSearchInput]);

  const handleHasUnreadChange = useCallback((v) => setHasNew(!!v), []);
  const openComposer = useCallback((receiver) => {
    setComposerReceiver(receiver || null);
    setComposerOpen(true);
  }, []);

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50 w-full">
      <div className="px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/home" className="text-lg font-bold text-blue-600 hover:no-underline">
            ScoopADive
          </Link>
        </div>

        {user ? (
          <ul className="flex items-center space-x-6 text-gray-600">
            <li className="flex items-center justify-center relative" ref={searchRef}>
              <button onClick={toggleSearchInput} className="hover:text-blue-500 transition" aria-label="Open search">
                <Search size={20} />
              </button>
              {showSearchInput && (
                <div className="absolute top-8 right-0 mt-2 bg-white border border-gray-300 rounded shadow-md p-2 z-50 w-64">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="px-2 py-1 w-full border border-gray-300 rounded focus:outline-none focus:ring"
                  />
                  <UserSearchModal
                    inlineQuery={query}
                    onCloseInline={() => setShowSearchInput(false)}
                    onCompose={openComposer}
                  />
                </div>
              )}
            </li>

            <li className="relative group flex items-center justify-center">
              <Link to="/log/new" className="hover:text-blue-500 transition" aria-label="Add log">
                <PlusCircle size={20} />
              </Link>
              <span className="absolute left-1/2 top-6 -translate-x-1/2 whitespace-nowrap text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Add Log
              </span>
            </li>

            <li className="flex items-center justify-center relative">
              <button
                className="hover:text-blue-500 transition relative"
                aria-label="Open notifications"
                onClick={() => setOpenNotifications(true)}
              >
                <Bell size={20} />
                {hasNew && !isAuthPage && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white" />
                )}
              </button>
            </li>

            <li className="flex items-center justify-center">
              <UserMenu />
            </li>
          </ul>
        ) : (
          <ul className="flex items-center space-x-6 text-sm font-medium text-gray-600">
            <li>
              <Link
                to="/signin"
                className={`hover:text-blue-500 transition ${location.pathname === "/signin" ? "text-blue-600 font-semibold" : ""}`}
              >
                Sign In
              </Link>
            </li>
            <li>
              <Link
                to="/signup"
                className={`hover:text-blue-500 transition ${location.pathname === "/signup" ? "text-blue-600 font-semibold" : ""}`}
              >
                Sign Up
              </Link>
            </li>
          </ul>
        )}
      </div>

      {openNotifications && (
        <NotificationCenter
          isOpen={openNotifications}
          onClose={() => setOpenNotifications(false)}
          onHasUnreadChange={handleHasUnreadChange}
          onCompose={openComposer}
        />
      )}

      <MessageComposer
        isOpen={composerOpen}
        onClose={() => setComposerOpen(false)}
        defaultReceiver={composerReceiver}
      />
    </nav>
  );
}

export default Navbar;
