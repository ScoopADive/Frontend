import {
  updateUserProfile,
  getFriendDetail,
  getAllUsers,
} from "../api/user";

const userService = {
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
