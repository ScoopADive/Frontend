// src/services/userService.js
import api from '../api/axios';
import { updateUserProfile, getFriendDetail, getAllUsers } from '../api/user';

const userService = {
  getMyProfile: async () => {
    const res = await api.get('/mypage/');
    return res.data;
  },
  updateProfile: async (id, profileData) => {
    return await updateUserProfile(id, profileData);
  },
  getFriendDetail: async (id) => {
    return await getFriendDetail(id);
  },
  getAllUsers: async () => {
    return await getAllUsers();
  },
};

export default userService;
