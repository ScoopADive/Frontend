// src/components/buttons/WordPressLoginButton.jsx
import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { getWPTokenList, fetchWPAuthorizeUrl, saveWPToken } from '../../api/wordpress';

export default function WordPressLoginButton({ className = '' }) {
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');
  const [manualOpen, setManualOpen] = useState(false);
  const [manualToken, setManualToken] = useState('');
  const [manualRefresh, setManualRefresh] = useState('');
  const pollTimer = useRef(null);
  const popupRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getWPTokenList()
      .then(data => {
        if (!mounted) return;
        const has = Array.isArray(data?.results) ? data.results.length > 0 : false;
        setConnected(has);
      })
      .catch(() => setConnected(false))
      .finally(() => setLoading(false));
    return () => {
      mounted = false;
      if (pollTimer.current) clearInterval(pollTimer.current);
      try { popupRef.current?.close?.(); } catch {}
    };
  }, []);

  const parseJsonSafe = txt => {
    try { return JSON.parse(txt); } catch { return null; }
  };

  const captureFromPopupDom = () => {
    try {
      const txt = popupRef.current?.document?.body?.innerText || popupRef.current?.document?.body?.textContent || '';
      if (!txt) return null;
      return parseJsonSafe(txt);
    } catch {
      return null;
    }
  };

  const captureByFetchingPopupUrl = async () => {
    try {
      const href = popupRef.current?.location?.href || '';
      if (!href) return null;
      const res = await fetch(href, { credentials: 'include' });
      const txt = await res.text();
      return parseJsonSafe(txt);
    } catch {
      return null;
    }
  };

  const trySavePayload = async payload => {
    if (!payload || !payload.access_token) return false;
    await saveWPToken({
      access_token: String(payload.access_token),
      refresh_token: payload.refresh_token ?? '',
      expires_at: null
    });
    return true;
  };

  const poll = async () => {
    try {
      const data = await getWPTokenList();
      const ok = Array.isArray(data?.results) && data.results.length > 0;
      if (ok) {
        setConnected(true);
        clearInterval(pollTimer.current);
        try { popupRef.current?.close?.(); } catch {}
        return true;
      }
    } catch {}
    return false;
  };

  const startPolling = () => {
    if (pollTimer.current) clearInterval(pollTimer.current);
    pollTimer.current = setInterval(async () => {
      const href = popupRef.current?.location?.href || '';
      if (href.includes('/wordpress/oauth/callback/swagger')) {
        let payload = captureFromPopupDom();
        if (!payload) payload = await captureByFetchingPopupUrl();
        if (payload) {
          const saved = await trySavePayload(payload);
          if (saved) {
            await poll();
            return;
          }
        }
      }
      await poll();
      if (popupRef.current && popupRef.current.closed) {
        clearInterval(pollTimer.current);
      }
    }, 700);
  };

  const handleClick = async () => {
    setError('');
    setStarting(true);
    try {
      const authUrl = await fetchWPAuthorizeUrl();
      const w = 560;
      const h = 720;
      const y = window.top.outerHeight / 2 + window.top.screenY - h / 2;
      const x = window.top.outerWidth / 2 + window.top.screenX - w / 2;
      popupRef.current = window.open(
        authUrl,
        'wp_oauth',
        `popup=yes,width=${w},height=${h},left=${x},top=${y}`
      );
      startPolling();
    } catch {
      setError('Failed to start WordPress OAuth');
    } finally {
      setStarting(false);
    }
  };

  const handleManualSave = async () => {
    setError('');
    try {
      await saveWPToken({
        access_token: manualToken.trim(),
        refresh_token: manualRefresh.trim(),
        expires_at: null
      });
      const data = await getWPTokenList();
      const ok = Array.isArray(data?.results) && data.results.length > 0;
      if (ok) {
        setConnected(true);
        setManualOpen(false);
        setManualToken('');
        setManualRefresh('');
      } else {
        setError('Token save failed');
      }
    } catch {
      setError('Token save failed');
    }
  };

  if (loading) {
    return (
      <button className={`rounded-lg px-4 py-2 bg-gray-200 text-gray-700 ${className}`} disabled>
        Checking WordPress...
      </button>
    );
  }

  if (connected) {
    return (
      <span className={`inline-flex items-center rounded-lg px-3 py-2 bg-emerald-100 text-emerald-700 text-sm ${className}`}>
        WordPress connected
      </span>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button onClick={handleClick} disabled={starting} className="rounded-lg px-4 py-2 bg-gray-900 text-white">
        {starting ? 'Connecting...' : 'Connect WordPress'}
      </button>
      <button onClick={() => setManualOpen(true)} className="rounded-lg px-3 py-2 border text-sm">
        Enter token
      </button>
      {error ? <span className="text-xs text-red-600">{error}</span> : null}

      {manualOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 space-y-3">
            <div className="text-base font-semibold">Paste access token</div>
            <input
              value={manualToken}
              onChange={e => setManualToken(e.target.value)}
              placeholder="access_token"
              className="w-full border rounded-lg px-3 py-2"
            />
            <input
              value={manualRefresh}
              onChange={e => setManualRefresh(e.target.value)}
              placeholder="refresh_token (optional)"
              className="w-full border rounded-lg px-3 py-2"
            />
            <div className="flex items-center justify-end gap-2 pt-1">
              <button onClick={() => setManualOpen(false)} className="border rounded-lg px-3 py-2">
                Cancel
              </button>
              <button onClick={handleManualSave} className="bg-indigo-600 text-white rounded-lg px-4 py-2">
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

WordPressLoginButton.propTypes = {
  className: PropTypes.string
};