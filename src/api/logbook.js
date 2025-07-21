import api from "./axios";

// 내 로그만 불러오기
export const getMyLogs = async () => {
  const res = await api.get("/logbooks/my_logbooks/");
  return res.data;
};

// 전체 로그 불러오기
export const getAllLogs = async () => {
  const res = await api.get("/logbooks/");
  console.log("🧾 getAllLogs 응답:", res.data); 
  return res.data;
};

// 특정 로그 조회
export const getLogById = async (id) => {
  const res = await api.get(`/logbooks/${id}/`);
  return res.data;
};

// 로그 작성
export const createLog = async (formData) => {
  const res = await api.post("/logbooks/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// 로그 삭제
export const deleteLog = async (id) => {
  const res = await api.delete(`/logbooks/${id}/`);
  return res.status;
};
