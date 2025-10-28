// src/services/bucketService.js
import api from "../api/axios";

const normalizeItem = (raw) => {
  if (!raw || typeof raw !== "object") return null;
  return {
    id: raw.id,
    title: raw.title,
    created_at: raw.created_at,
    user: raw.user,
  };
};

const normalizeList = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data.map(normalizeItem).filter(Boolean);
  const results = Array.isArray(data.results) ? data.results : [];
  return results.map(normalizeItem).filter(Boolean);
};

export const fetchBucketList = async (page = 1) => {
  try {
    const res = await api.get("mypage/bucketlists/", { params: { page } });
    return normalizeList(res?.data);
  } catch {
    return [];
  }
};

export const addBucketItem = async (title, userId) => {
  const fd = new FormData();
  fd.append("title", title);
  fd.append("user", userId);
  const res = await api.post("mypage/bucketlists/", fd, { headers: {} });
  return normalizeItem(res?.data);
};

export const updateBucketItem = async (id, data) => {
  const fd = new FormData();
  if (data?.title !== undefined) fd.append("title", data.title);
  if (data?.user !== undefined) fd.append("user", data.user);
  const res = await api.put(`mypage/bucketlists/${id}/`, fd, { headers: {} });
  return normalizeItem(res?.data);
};

export const patchBucketItem = async (id, data) => {
  const fd = new FormData();
  if (data?.title !== undefined) fd.append("title", data.title);
  if (data?.user !== undefined) fd.append("user", data.user);
  const res = await api.patch(`mypage/bucketlists/${id}/`, fd, { headers: {} });
  return normalizeItem(res?.data);
};

export const deleteBucketItem = async (id) => {
  await api.delete(`mypage/bucketlists/${id}/`);
  return true;
};

const bucketService = {
  getList: fetchBucketList,
  create: addBucketItem,
  update: updateBucketItem,
  patch: patchBucketItem,
  remove: deleteBucketItem,
};

export default bucketService;
