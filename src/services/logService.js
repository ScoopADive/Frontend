import {
  getAllLogs,
  getMyLogs,
  getLogById,
  createLog,
  deleteLog,
} from "../api/logbook";

import api from "../api/axios";

const logService = {
  getAllLogs,
  getMyLogs,
  getLogById,
  createLog,
  deleteLog,

  updateLog: async (id, formData) => {
    try {
      const res = await api.put(`/logbooks/${id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (err) {
      console.error("❌ 로그 수정 실패:", err);
      throw err;
    }
  },
};

export default logService;

