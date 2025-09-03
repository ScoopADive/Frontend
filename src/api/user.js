import api from './axios';

export const getMyProfile = async () => {
  const res = await api.get('mypage/profile/');
  return res.data;
};

export const updateUserProfile = async (id, data) => {
  const fd = new FormData();
  const putIfFilled = (k, v) => {
    if (v === undefined || v === null) return;
    if (typeof v === 'string' && v.trim() === '') return;
    fd.append(k, v);
  };
  const ALLOWED_LICENSES = [
    'PADI Scuba Diver',
    'PADI Open Water Diver',
    'PADI Advanced Open Water Diver',
    'PADI Adventure Diver',
    'PADI Rescue Diver',
    'Emergency First Response (EFR)',
    'PADI Master Scuba Diver',
    'Deep Diver',
    'Night Diver',
    'Wreck Diver',
    'Underwater Navigation',
    'Peak Performance Buoyancy',
    'Enriched Air Diver (Nitrox)',
    'Dry Suit Diver',
    'Search and Recovery Diver',
    'Drift Diver',
    'Altitude Diver',
    'Boat Diver',
    'Sidemount Diver',
    'Digital Underwater Photographer',
    'Underwater Naturalist',
    'Multilevel Diver',
    'Fish Identification',
    'Ice Diver',
    'Cavern Diver',
    'Self-Reliant Diver (for experienced divers)',
    'PADI Divemaster',
    'PADI Assistant Instructor',
    'PADI Open Water Scuba Instructor (OWSI)',
    'PADI Specialty Instructor',
    'PADI Master Scuba Diver Trainer (MSDT)',
    'PADI IDC Staff Instructor',
    'PADI Master Instructor',
    'PADI Course Director',
    'Tec 40',
    'Tec 45',
    'Tec 50',
    'Tec Trimix 65',
    'Tec Trimix Diver',
    'Tec Sidemount Diver',
    'Tec Gas Blender',
    'PADI Rebreather Diver',
    'Advanced Rebreather Diver'
  ];
  putIfFilled('username', data.username);
  putIfFilled('email', data.email);
  putIfFilled('country', data.country);
  if (typeof data.license === 'string' && ALLOWED_LICENSES.includes(data.license)) {
    fd.append('license', data.license);
  }
  putIfFilled('introduction', data.introduction);
  if (data.profile_image instanceof File) {
    fd.append('profile_image', data.profile_image);
  }
  const res = await api.put(`mypage/edit_profile/${id}/`, fd, { headers: {} });
  return res.data;
};

export const getFriendDetail = async (id) => {
  const res = await api.get(`mypage/friend/${id}/`);
  return res.data;
};

export const getAllUsers = async () => {
  const res = await api.get('users/');
  return res.data;
};
