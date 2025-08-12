import api from '../api/axios';

// 서버가 페이지네이션 객체를 주므로 results를 꺼내서 배열로 반환
const normalizeList = (data) => {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.results)) return data.results;
  return [];
};

// 버킷리스트 전체 조회 (GET /mypage/bucketlists/?page=1)
export const fetchBucketList = async (page = 1) => {
  try {
    const res = await api.get(`mypage/bucketlists/?page=${page}`);
    return normalizeList(res.data);
  } catch (err) {
    console.error('❌ 버킷리스트 조회 실패:', err);
    return [];
  }
};

// 항목 추가 (POST /mypage/bucketlists/ , form-data: title[, user])
export const addBucketItem = async (title, userId = null) => {
  try {
    const fd = new FormData();
    fd.append('title', title);
    if (userId) fd.append('user', String(userId));
    const res = await api.post('mypage/bucketlists/', fd, { headers: {} });
    return res.data; // { id, title, created_at, user, ... }
  } catch (err) {
    console.error('❌ 버킷리스트 추가 실패:', err?.response?.data || err.message);
    throw err;
  }
};

// 항목 수정 (PUT /mypage/bucketlists/{id}/ , form-data)
export const updateBucketItem = async (id, data) => {
  try {
    const fd = new FormData();
    Object.entries(data || {}).forEach(([k, v]) => fd.append(k, v));
    const res = await api.put(`mypage/bucketlists/${id}/`, fd, { headers: {} });
    return res.data;
  } catch (err) {
    console.error(`❌ 버킷리스트 항목 수정 실패 (id: ${id})`, err?.response?.data || err.message);
    throw err;
  }
};

// 항목 삭제 (DELETE /mypage/bucketlists/{id}/)
export const deleteBucketItem = async (id) => {
  try {
    await api.delete(`mypage/bucketlists/${id}/`);
    return true;
  } catch (err) {
    console.error(`❌ 버킷리스트 항목 삭제 실패 (id: ${id})`, err?.response?.data || err.message);
    throw err;
  }
};

const bucketService = {
  getList: fetchBucketList,
  create: addBucketItem,
  update: updateBucketItem,
  remove: deleteBucketItem,
};

export default bucketService;
