// src/api/wordpress.js
import api from './axios';

/** 배열/페이지네이션 응답을 통일 */
function normalizeList(data) {
  if (Array.isArray(data)) return { results: data };
  if (data && Array.isArray(data.results)) return data;
  return { results: [] };
}

/** 현재 저장된 WP 토큰 목록 */
export async function getWPTokenList() {
  const r = await api.get('/wordpress/wordpress-tokens/');
  return normalizeList(r?.data);
}

/** 로그북을 워드프레스에 발행 */
export async function publishLogbookToWP(logbookId) {
  const r = await api.post('/wordpress/logbook-post/post_to_wp/', { logbook_id: logbookId });
  return r.data;
}

/**
 * OAuth 시작 URL 요청 (정식 엔드포인트만 사용)
 * - 백엔드가 {auth_url|authorize_url|url} 중 하나로 내려준다고 가정
 */
export async function fetchWPAuthorizeUrl() {
  const res = await api.get('/wordpress/oauth/login/');
  const raw = res?.data;
  const url =
    raw?.auth_url ||
    raw?.authorize_url ||
    raw?.url ||
    raw?.data?.auth_url ||
    raw?.data?.url ||
    (typeof raw === 'string' ? raw : '');
  if (!url || typeof url !== 'string') {
    const err = new Error('Authorize URL not found');
    err.__raw = raw;
    throw err;
  }
  return url;
}

/** axios baseURL을 절대경로 문자열로 안전 취득 */
export function getApiBaseUrl() {
  let base = '';
  try {
    base = api?.defaults?.baseURL || '';
  } catch {}
  if (!base) return '';
  return String(base).replace(/\/+$/, '');
}
