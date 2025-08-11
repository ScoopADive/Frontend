import api from './axios';

// 프로필 수정
export const updateUserProfile = async (id, profileData) => {
  const res = await api.put(`/api/mypage/edit_profile/${id}/`, profileData);
  return res.data;
};

// 친구 상세 조회
export const getFriendDetail = async (id) => {
  const res = await api.get(`/api/mypage/friend/${id}/`);
  return res.data;
};

// 전체 유저 조회 예시 코드
export const getAllUsers = async () => {
  const res = await api.get('/api/users/'); // 수정 필요
  return res.data;
};
