import api from '../api/axios';

// 버킷리스트 전체 조회
export const fetchBucketList = async () => {
  try {
    const res = await api.get('api/bucketlist/');
    return res.data || [];
  } catch (err) {
    console.error('❌ 버킷리스트 조회 실패:', err);
    return [];
  }
};

// 항목 추가
export const addBucketItem = async (title) => {
  try {
    const res = await api.post('api/bucketlist/', { title });
    return res.data;
  } catch (err) {
    console.error('❌ 버킷리스트 추가 실패:', err);
    throw err;
  }
};

// 항목 수정
export const updateBucketItem = async (id, data) => {
  try {
    const res = await api.put(`api/bucketlist/${id}/`, data);
    return res.data;
  } catch (err) {
    console.error(`❌ 버킷리스트 항목 수정 실패 (id: ${id})`, err);
    throw err;
  }
};

// 항목 삭제
export const deleteBucketItem = async (id) => {
  try {
    await api.delete(`api/bucketlist/${id}/`);
    return true;
  } catch (err) {
    console.error(`❌ 버킷리스트 항목 삭제 실패 (id: ${id})`, err);
    throw err;
  }
};

// 서비스 통합
const bucketService = {
  getList: fetchBucketList,
  create: addBucketItem,
  update: updateBucketItem,
  remove: deleteBucketItem,
};

export default bucketService;
