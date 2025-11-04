import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { getWPTokenList, fetchWPAuthorizeUrl } from '../../api/wordpress';

export default function WordPressLoginButton({ className = '' }) {
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');

  const pollTimer = useRef(null);
  const popupRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await getWPTokenList();
        const has = Array.isArray(data?.results) && data.results.length > 0;
        if (mounted) setConnected(has);
      } catch {
        if (mounted) setConnected(false);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
      if (pollTimer.current) clearInterval(pollTimer.current);
      try { popupRef.current?.close?.(); } catch {}
    };
  }, []);

  const startPolling = () => {
    if (pollTimer.current) clearInterval(pollTimer.current);
    pollTimer.current = setInterval(async () => {
      try {
        const data = await getWPTokenList();
        const ok = Array.isArray(data?.results) && data.results.length > 0;
        if (ok) {
          setConnected(true);
          clearInterval(pollTimer.current);
          try { popupRef.current?.close?.(); } catch {}
          return;
        }
      } catch {}
      if (popupRef.current && popupRef.current.closed) clearInterval(pollTimer.current);
    }, 700);
  };

  const openPopup = (url) => {
    const w = 560, h = 720;
    const y = window.top.outerHeight / 2 + window.top.screenY - h / 2;
    const x = window.top.outerWidth / 2 + window.top.screenX - w / 2;
    popupRef.current = window.open(
      url,
      'wp_oauth',
      `popup=yes,width=${w},height=${h},left=${x},top=${y}`
    );
  };

  const handleClick = async () => {
    setError('');
    setStarting(true);
    try {
      // ✅ 반드시 인증된 XHR로 받은 auth_url만 사용
      const authUrl = await fetchWPAuthorizeUrl();
      openPopup(authUrl);
      startPolling();
    } catch (e) {
      const msg = e?.message || 'Failed to start WordPress OAuth';
      const status = e?.response?.status;
      const detail = e?.response?.data?.detail;
      setError(status ? `${msg} [${status}]${detail ? ` ${detail}` : ''}` : msg);
    } finally {
      setStarting(false);
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
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </div>
  );
}

WordPressLoginButton.propTypes = { className: PropTypes.string };
