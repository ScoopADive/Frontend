import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import userService from "../../services/userService";

const DEBOUNCE_MS = 250;

export default function UserSearchModal({ inlineQuery, onCloseInline, onCompose }) {
  const [q, setQ] = useState(inlineQuery || "");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => setQ(inlineQuery || ""), [inlineQuery]);

  useEffect(() => {
    const h = setTimeout(async () => {
      const term = String(q || "").trim();
      if (!term) {
        setResults([]);
        return;
      }
      try {
        setLoading(true);
        // 백엔드가 없을 때를 대비한 모의 데이터
        let arr = [];
        if (typeof userService.searchUsers === "function") {
          arr = await userService.searchUsers(term);
        } else if (typeof userService.getAllUsers === "function") {
          const list = await userService.getAllUsers();
          arr = Array.isArray(list) ? list : Array.isArray(list?.results) ? list.results : [];
          const t = term.toLowerCase();
          arr = arr.filter(
            (u) =>
              String(u.username || u.name || "").toLowerCase().includes(t) ||
              String(u.email || "").toLowerCase().includes(t)
          );
        } else {
          // 모의 데이터
          const mock = [
            { id: 1, username: "Suzy", email: "suzy@example.com" },
            { id: 2, username: "Mina", email: "mina@example.com" },
            { id: 3, username: "Jisoo", email: "jisoo@example.com" },
          ];
          const t = term.toLowerCase();
          arr = mock.filter(
            (u) =>
              u.username.toLowerCase().includes(t) ||
              u.email.toLowerCase().includes(t)
          );
        }
        setResults(arr.slice(0, 6));
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_MS);
    return () => clearTimeout(h);
  }, [q]);

  const hasItems = useMemo(() => Array.isArray(results) && results.length > 0, [results]);

  return (
    <div className="mt-2">
      {loading ? (
        <div className="text-xs text-gray-500 px-1.5 py-1">Searching...</div>
      ) : hasItems ? (
        <ul className="divide-y divide-gray-200 max-h-64 overflow-auto">
          {results.map((u) => {
            const receiver = {
              id: u.id || u.user_id,
              username: u.username || u.name,
              displayName: u.username || u.name || "Unknown",
            };
            return (
              <li key={u.id || u.username} className="py-2 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {u.username || u.name || "Unknown"}
                  </div>
                  <div className="text-xs text-gray-500 truncate">{u.email || "-"}</div>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <a
                    href={`/user/${u.username || u.name || ""}`}
                    className="text-xs px-2 py-1 rounded border border-gray-300 hover:bg-gray-50"
                    onClick={onCloseInline}
                  >
                    View
                  </a>
                  <button
                    className="text-xs px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => onCompose?.(receiver)}
                  >
                    Message
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : q ? (
        <div className="text-xs text-gray-500 px-1.5 py-1">No results.</div>
      ) : null}
    </div>
  );
}

UserSearchModal.propTypes = {
  inlineQuery: PropTypes.string,
  onCloseInline: PropTypes.func,
  onCompose: PropTypes.func,
};
