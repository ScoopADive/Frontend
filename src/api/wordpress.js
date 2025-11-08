// src/api/wordpress.js
import api from './axios';

/** 토큰 목록 조회 (pagination/array/single-object 모두 호환) */
export async function getWPTokenList() {
  const r = await api.get('/wordpress/wordpress-tokens/');
  const d = r?.data;

  // 1) 응답이 배열인 경우: [ {...}, {...} ]
  if (Array.isArray(d)) {
    return { results: d };
  }

  // 2) 응답이 { results: [...] } 형태인 경우 (DRF pagination)
  if (d && Array.isArray(d.results)) {
    return { results: d.results };
  }

  // 3) 응답이 단일 객체인 경우: { id: 5, user: 1, ... }
  if (d && typeof d === 'object') {
    return { results: [d] };
  }

  // 4) 그 외에는 빈 배열
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

/** URL-safe 인코딩 (간단·확실한 방식: percent-encoding) */
function urlSafe(str) {
  try {
    return encodeURIComponent(str);
  } catch {
    return str;
  }
}

/**
 * OAuth 시작 URL(=우리 백엔드 엔드포인트)을 만들어 반환한다.
 * 핵심: JWT를 URL-safe로 인코딩해 state와 token 둘 다에 담는다.
 * 절대 fetch/XHR 금지. 이 URL을 window.open()에 직접 넣어 팝업 네비게이션만 발생시킨다.
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
      jwt = window.__APP_JWT || jwt; // 앱 전역에 올려둔 경우
    }
  } catch {
    // ignore
  }

  if (requireAuth && !looksLikeJWT(jwt)) {
    const err = new Error('NO_JWT');
    err.code = 'NO_JWT';
    throw err;
  }

  // URL 조립
  const start = buildApiUrl('/wordpress/oauth/login/');
  const startUrl = new URL(start, window.location.origin);

  if (looksLikeJWT(jwt)) {
    const jwtSafe = urlSafe(jwt);
    // WP 표준(state) + 기존 백엔드(token) 모두 전달
    startUrl.searchParams.set('state', jwtSafe);
    startUrl.searchParams.set('token', jwtSafe);
  }

  return startUrl.toString();
}
