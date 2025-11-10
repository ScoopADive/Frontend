// src/api/user.js
import api from './axios';

export const ALLOWED_LICENSES = [
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

export const getMyProfile = async () => {
  const res = await api.get('mypage/profile/');
  return res.data;
};

export const updateUserProfile = async (id, data) => {
  const fd = new FormData();

  const username =
    typeof data.username === 'string' ? data.username.trim() : '';
  const email =
    typeof data.email === 'string' ? data.email.trim() : '';
  const country =
    typeof data.country === 'string' ? data.country.trim() : '';
  const introduction =
    typeof data.introduction === 'string' ? data.introduction.trim() : '';
  const rawLicense =
    typeof data.license === 'string' ? data.license.trim() : '';

  fd.append('username', username);
  fd.append('email', email);
  fd.append('country', country);

  if (rawLicense && ALLOWED_LICENSES.includes(rawLicense)) {
    fd.append('license', rawLicense);
  } else {
    fd.append('license', '');
  }

  fd.append('introduction', introduction);

  const profileImage = data.profile_image;
  if (profileImage instanceof File || profileImage instanceof Blob) {
    fd.append('profile_image', profileImage);
  }

  try {
    const res = await api.put(`mypage/edit_profile/${id}/`, fd);
    return res.data;
  } catch (err) {
    throw err?.response?.data ?? { detail: 'Bad Request' };
  }
};

export const getFriendDetail = async (id) => {
  const res = await api.get(`mypage/friend/${id}/`);
  return res.data;
};

export const getAllUsers = async () => {
  const res = await api.get('users/');
  return res.data;
};
