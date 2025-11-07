import api from './axios';

export function getWPTokenList() {
  return api.get('/wordpress/wordpress-tokens/').then((r) => r.data);
}

export function saveWPToken(data) {
  return api.post('/wordpress/wordpress-tokens/', data).then((r) => r.data);
}

export function publishLogbookToWP(logbookId) {
  return api
    .post('/wordpress/logbook-post/post_to_wp/', { logbook_id: logbookId })
    .then((r) => r.data);
}

export async function fetchWPAuthorizeUrl() {
  const res = await api.get('/wordpress/oauth/login/');
  const raw = res?.data;
  let url = raw?.url || raw?.authorize_url || raw?.auth_url || (typeof raw === 'string' ? raw : '');

  // url이 /api 없이 오면 자동으로 붙이기
  if (url && url.startsWith('/wordpress')) {
    url = api.defaults.baseURL.replace(/\/$/, '') + url;
  }

  if (!url) throw new Error('Authorize URL not found');
  return url;
}
