import api from './axios';

function normalizeList(data) {
  if (Array.isArray(data)) return { results: data };
  if (data && Array.isArray(data.results)) return data;
  return { results: [] };
}

export async function getWPTokenList() {
  const r = await api.get('/wordpress/wordpress-tokens/');
  return normalizeList(r?.data);
}

export async function publishLogbookToWP(logbookId) {
  const r = await api.post('/wordpress/logbook-post/post_to_wp/', { logbook_id: logbookId });
  return r.data;
}

/** 반드시 인증된 XHR로만 auth_url 수신 */
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
