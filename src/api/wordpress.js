// src/api/wordpress.js
import api from './axios';

/** 토큰 목록 조회 (pagination/array 모두 호환) */
export async function getWPTokenList() {
  const r = await api.get('/wordpress/wordpress-tokens/');
  const d = r?.data;
  if (Array.isArray(d)) return { results: d };
  if (Array.isArray(d?.results)) return d;
  return { results: [] };
}

/** 토큰 저장 (필요 시 수동 입력용) */
export async function saveWPToken(data) {
  const payload = {
    access_token: String(data?.access_token || ''),
    refresh_token: String(data?.refresh_token || ''),
    expires_at: data?.expires_at ?? null,
  };
  const r = await api.post('/wordpress/wordpress-tokens/', payload);
  return r.data;
}

/** 로그북을 워드프레스에 발행 */
export async function publishLogbookToWP(logbookId) {
  const r = await api.post('/wordpress/logbook-post/post_to_wp/', { logbook_id: logbookId });
  return r.data;
}

/**
 * 팝업이 열 주소(=우리 백엔드 로그인 엔드포인트)를 문자열로 반환
 * 절대 fetch/XHR를 하지 않는다! 브라우저 네비게이션만 하게 둔다.
 */
function buildApiUrl(path) {
  const base = (api?.defaults?.baseURL || '/api').toString().replace(/\/+$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

export function getWPOAuthStartUrl() {
  // 백엔드가 여기서 302로 WordPress authorize로 리다이렉트해야 함
  return buildApiUrl('/wordpress/oauth/login/');
}
