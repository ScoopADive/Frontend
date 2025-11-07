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

/** 쿠키에서 키=값 찾기 (JWT가 쿠키에 있을 수도 있음) */
function getCookie(name) {
  if (typeof document === 'undefined') return '';
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : '';
}

/** 문자열이 JWT 형태인지 대략 검증 */
function looksLikeJWT(t) {
  return typeof t === 'string' && t.split('.').length === 3 && t.length > 20;
}

/**
 * OAuth 시작 URL(=우리 백엔드 엔드포인트)을 만들어 반환한다.
 * 핵심: JWT를 state로 쿼리에 붙여서 백엔드가 그대로 워드프레스로 넘기게 한다.
 * 절대 fetch/XHR 금지. 이 URL을 'window.open()' 에 직접 넣어 팝업 네비게이션만 발생시킨다.
 *
 * @param {object} opts
 * @param {boolean} opts.requireAuth JWT가 없으면 에러를 던질지 여부 (기본 true)
 */
export function getWPOAuthStartUrl(opts = { requireAuth: true }) {
  const { requireAuth = true } = opts;

  // JWT 가져오기: 여러 저장소에서 방어적으로 탐색
  let jwt = '';
  try {
    if (typeof localStorage !== 'undefined') {
      jwt =
        localStorage.getItem('access') ||
        localStorage.getItem('access_token') ||
        localStorage.getItem('jwt') ||
        '';
    }
    if (!looksLikeJWT(jwt) && typeof sessionStorage !== 'undefined') {
      jwt =
        sessionStorage.getItem('access') ||
        sessionStorage.getItem('access_token') ||
        sessionStorage.getItem('jwt') ||
        jwt;
    }
    if (!looksLikeJWT(jwt)) {
      jwt = getCookie('access') || getCookie('jwt') || jwt;
    }
    if (!looksLikeJWT(jwt) && typeof window !== 'undefined') {
      jwt = window.__APP_JWT || jwt; // 앱에서 전역에 올려뒀을 수도 있음
    }
  } catch {
    // 무시
  }

  if (requireAuth && !looksLikeJWT(jwt)) {
    // 프론트에서 로그인 상태가 아니라면 팝업을 열어도 콜백에서 401이 날 뿐이므로 여기서 중단
    const err = new Error('NO_JWT');
    err.code = 'NO_JWT';
    throw err;
  }

  // state는 URL-안전하게 인코딩 (백엔드에서 그대로 WP authorize에 pass-through)
  const start = buildApiUrl('/wordpress/oauth/login/');
  const startUrl = new URL(start, window.location.origin);
  if (looksLikeJWT(jwt)) {
    startUrl.searchParams.set('state', jwt);
  }

  // 디버깅에 도움: 실제로 state가 붙었는지 확인하고 싶을 때 콘솔에서 확인 가능
  // console.debug('[WP] oauth start url =', startUrl.toString());

  return startUrl.toString();
}
