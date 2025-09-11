import { sendMessage, getInbox, getSent, markAsRead } from "../api/messages";

const TEMPLATES = {
  INVITE: "INVITE",
  LOG_REQUEST: "LOG_REQUEST",
  SHORT_DM: "SHORT_DM",
};

const messageService = {
  templates: TEMPLATES,

  async send({ receiver, content, template }) {
    const body = {
      content: String(content || "").slice(0, 200),
      template: template || TEMPLATES.SHORT_DM,
    };
    if (receiver?.id) body.receiver_id = receiver.id;
    else if (receiver?.username) body.receiver_username = receiver.username;

    try {
      return await sendMessage(body);
    } catch {
      // 모의 성공
      return { id: "mock", ...body };
    }
  },

  async getInbox() {
    try {
      const data = await getInbox();
      const list = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
      return list;
    } catch {
      // 모의 받은 편지함
      return [
        { id: "im1", content: "Can you share your Jeju log?", created_at: new Date().toISOString(), sender: { username: "Suzy" } },
      ];
    }
  },

  async getSent() {
    try {
      const data = await getSent();
      const list = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
      return list;
    } catch {
      // 모의 보낸 편지함
      return [
        { id: "sm1", content: "Join a dive this weekend?", created_at: new Date().toISOString(), receiver: { username: "Mina" } },
      ];
    }
  },

  async markAsRead(id) {
    try {
      return await markAsRead(id);
    } catch {
      return true;
    }
  },
};

export default messageService;
