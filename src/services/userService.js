import { getMyProfile, updateUserProfile, getFriendDetail, getAllUsers } from '../api/user';

const userService = {
  getMyProfile: async () => {
    return await getMyProfile();
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
