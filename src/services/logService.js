import { getAllLogs, getMyLogs, getLogById, createLog, deleteLog } from '../api/logbook';

import api from '../api/axios';

const likeLog = async (id) => {
  const res = await api.post(`/logbooks/${id}/like/`);
  // 백엔드가 liked, likes_count 반환한다고 가정
  return {
    liked: res.data.liked, // true면 현재 좋아요 된 상태
    likes_count: res.data.likes_count,
  };
};

const logService = {
  getAllLogs,
  getMyLogs,
  getLogById,
  createLog,
  deleteLog,
  likeLog,

  updateLog: async (id, formData) => {
    try {
      const res = await api.patch(`logbooks/${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    } catch (err) {
      console.error('❌ 로그 수정 실패:', err.response?.data || err);
      throw err;
    }
  },
};

export default logService;
