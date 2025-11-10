// src/api/preferences.js
import api from './axios';

/**
 * GET /settings/preferences/
 * - 응답이
 *   1) 배열  [ {...}, {...} ]
 *   2) { results: [ {...}, ... ] }
 *   둘 다 올 수 있다고 보고 첫 번째 객체만 반환
 */
export async function fetchMyPreferences() {
  try {
    const res = await api.get('/settings/preferences/');
    const data = res.data;

    if (!data) return null;

    // 1) 그냥 배열로 오는 경우
    if (Array.isArray(data)) {
      if (data.length === 0) return null;
      return data[0];
    }

    // 2) { results: [...] } 형태인 경우
    if (Array.isArray(data.results)) {
      if (data.results.length === 0) return null;
      return data.results[0];
    }

    // 3) 단일 객체로 오는 경우
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
 * (옵션) 설문 upsert 헬퍼
 * - 다른 곳에서 쓸 수도 있으니 남겨둠
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
