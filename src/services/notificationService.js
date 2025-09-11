import { getNotifications, markNotificationRead } from "../api/notifications";

const notificationService = {
  async getNotifications() {
    try {
      const data = await getNotifications();
      const list = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
      return list.map((n) => ({
        id: n.id,
        type: n.type || "generic",
        title: n.title,
        is_read: !!n.is_read,
        created_at: n.created_at,
        link: n.link,
        meta: n.meta || {},
      }));
    } catch {
      // 백엔드가 아직 없을 때 모의 데이터
      return [
        {
          id: "m1",
          type: "message",
          is_read: false,
          created_at: new Date().toISOString(),
          meta: { sender: { id: 2, username: "Mina" }, preview: "Join a dive this weekend?" },
        },
        {
          id: "c1",
          type: "comment",
          is_read: true,
          created_at: new Date(Date.now() - 3600 * 1000).toISOString(),
          meta: { actor: "Suzy" },
          link: "/log/123",
        },
      ];
    }
  },

  async markAsRead(id) {
    try {
      return await markNotificationRead(id);
    } catch {
      return true;
    }
  },
};

export default notificationService;
