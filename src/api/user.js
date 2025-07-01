import api from "./axios";

// 프로필 수정
export const updateUserProfile = async (id, profileData) => {
  const res = await api.put(`/mypage/edit_profile/${id}/`, profileData);
  return res.data;
};

// 친구 상세 조회
export const getFriendDetail = async (id) => {
  const res = await api.get(`/mypage/friend/${id}/`);
  return res.data;
};
