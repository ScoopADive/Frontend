// src/api/preferences.js
import api from './axios';

/**
 * GET /settings/preferences/
 * - 백엔드에서 리스트를 돌려줄 수도 있으니
 *   첫 번째 객체만 사용하도록 방어적으로 처리
 */
export async function fetchMyPreferences() {
  try {
    const res = await api.get('/settings/preferences/');
    const data = res.data;

    if (!data) return null;

    if (Array.isArray(data)) {
      if (data.length === 0) return null;
      return data[0];
    }

    return data;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      // 아직 설문이 없는 경우
      return null;
    }
    console.error('❌ fetchMyPreferences failed:', err);
    throw err;
  }
}

/** POST /settings/preferences/ - 최초 설문 생성 */
export async function createPreferences(payload) {
  const res = await api.post('/settings/preferences/', payload);
  return res.data;
}

/** PUT /settings/preferences/{id}/ - 설문 수정 */
export async function updatePreferences(id, payload) {
  const res = await api.put(`/settings/preferences/${id}/`, payload);
  return res.data;
}

/**
 * 설문 upsert 헬퍼
 * - 기존 preferences가 있으면 PUT
 * - 없으면 POST
 * - 호출하는 쪽에서 id를 모를 때 편하게 사용
 */
export async function upsertPreferences(payload) {
  const existing = await fetchMyPreferences();

  if (existing && existing.id) {
    const updated = await updatePreferences(existing.id, payload);
    return updated;
  }

  const created = await createPreferences(payload);
  return created;
}
