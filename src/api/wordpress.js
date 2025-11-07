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

/** 내부 유틸: 베이스 URL 조립 */
function buildApiUrl(path) {
  const base = (api?.defaults?.baseURL || '/api').toString().replace(/\/+$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

/**
 * OAuth 시작 URL(=우리 백엔드 엔드포인트)을 만들어 반환한다.
 * 핵심: JWT를 state로 쿼리에 붙여서 백엔드가 그대로 워드프레스로 넘기게 한다.
 * 절대 fetch/XHR 금지. 이 URL을 'window.open()' 에 직접 넣어 팝업 네비게이션만 발생시킨다.
 */
export function getWPOAuthStartUrl() {
  // JWT 가져오기: 프로젝트에 맞는 저장소를 우선 순위로 탐색
  let jwt =
    (typeof localStorage !== 'undefined' && (localStorage.getItem('access_token') || localStorage.getItem('jwt') || '')) || '';

  try {
    // Zustand 등에서 관리한다면 여기에서 가져오도록 확장 가능
    // 예: const { token } = useUserStore.getState(); if (token) jwt = token;
  } catch {}

  // state는 URL-안전하게 인코딩 (백엔드에서 그대로 WP authorize에 pass-through)
  const startUrl = new URL(buildApiUrl('/wordpress/oauth/login/'), window.location.origin);
  if (jwt) startUrl.searchParams.set('state', jwt);

  return startUrl.toString();
}
