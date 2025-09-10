import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import notificationService from "../../services/notificationService";

export default function NotificationCenter({ isOpen, onClose, onHasUnreadChange, onCompose }) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  const load = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications();
      setItems(data);
      const anyUnread = data.some((n) => !n.is_read);
      onHasUnreadChange?.(anyUnread);
    } catch {
      setItems([]);
      onHasUnreadChange?.(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const markRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
      const anyUnread = items.some((n) => n.id !== id && !n.is_read);
      onHasUnreadChange?.(anyUnread);
    } catch {}
  };

  const onItemClick = async (n) => {
    if (n.type === "message") {
      const sender = n?.meta?.sender || {};
      const receiver = {
        id: sender.id,
        username: sender.username,
        displayName: sender.username || "Unknown",
      };
      onCompose?.(receiver);
    } else if (n.link) {
      window.location.assign(n.link);
    }
    if (!n.is_read) await markRead(n.id);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-start justify-end bg-black/30 pt-16">
      <div className="w-full max-w-md bg-white rounded-l-2xl shadow-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          <button className="text-sm text-gray-600 hover:underline" onClick={onClose}>Close</button>
        </div>

        <div className="min-h-[300px]">
          {loading ? (
            <div className="text-gray-500">Loading...</div>
          ) : items.length === 0 ? (
            <div className="text-gray-500">No notifications.</div>
          ) : (
            <ul className="space-y-2">
              {items.map((n) => (
                <li
                  key={n.id}
                  className={`border rounded-xl p-4 bg-white shadow-sm cursor-pointer ${n.is_read ? "" : "border-blue-300"}`}
                  onClick={() => onItemClick(n)}
                >
                  <div className="text-sm text-gray-900">{renderTitle(n)}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(n.created_at).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button onClick={load} className="text-sm text-blue-600 hover:underline">Refresh</button>
          <div />
        </div>
      </div>
    </div>
  );
}

function renderTitle(n) {
  if (n.type === "message") return `New message from ${n?.meta?.sender?.username || "someone"}: ${n?.meta?.preview || ""}`;
  if (n.type === "comment") return `${n?.meta?.actor || "Someone"} commented on your log`;
  if (n.type === "like") return `${n?.meta?.actor || "Someone"} liked your log`;
  if (n.type === "friend") return `${n?.meta?.actor || "Someone"} sent you a friend request`;
  return n.title || "Notification";
}

NotificationCenter.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  onHasUnreadChange: PropTypes.func,
  onCompose: PropTypes.func,
};
