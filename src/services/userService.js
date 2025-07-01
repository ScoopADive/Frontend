import { updateUserProfile, getFriendDetail } from "../api/user";

const userService = {
  updateProfile: async (id, profileData) => {
    return await updateUserProfile(id, profileData);
  },

  getFriendDetail: async (id) => {
    return await getFriendDetail(id);
  },
};

export default userService;

