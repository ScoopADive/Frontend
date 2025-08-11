import api from './axios';

// 내 로그만 불러오기
export const getMyLogs = async () => {
  const res = await api.get('/api/logbooks/my_logbooks/');
  return res.data;
};

// 전체 로그 불러오기 (모든 페이지 순회)
export const getAllLogs = async () => {
  let results = [];
  let nextUrl = '/api/logbooks/?page_size=100';

  while (nextUrl) {
    const res = await api.get(nextUrl);
    const data = res.data;

    results = results.concat(data.results);
    nextUrl = data.next?.replace('http://scoopadive.com', ''); // API 주소 정리
  }

  console.log('✅ 모든 로그 불러오기 완료:', results.length, '개');
  return results;
};

// 특정 로그 조회
export const getLogById = async (id) => {
  const res = await api.get(`/api/logbooks/${id}/`);
  return res.data;
};

// 로그 작성
export const createLog = async (formData) => {
  const res = await api.post('/api/logbooks/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

// 로그 삭제
export const deleteLog = async (id) => {
  const res = await api.delete(`/api/logbooks/${id}/`);
  return res.status;
};
