import api from "./axios";

export const sendMessage = async (payload) => {
  const res = await api.post("messages/", payload, { headers: {} });
  return res.data;
};

export const getInbox = async () => {
  const res = await api.get("messages/inbox/");
  return res.data;
};

export const getSent = async () => {
  const res = await api.get("messages/sent/");
  return res.data;
};

export const markAsRead = async (id) => {
  const res = await api.post(`messages/read/${id}/`);
  return res.data;
};
