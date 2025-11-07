// src/components/buttons/WordPressLoginButton.jsx
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

  // 최초 연결 상태 확인
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
      try {
        popupRef.current?.close?.();
      } catch {}
    };
  }, []);

  // 토큰 폴링
  const startPolling = () => {
    if (pollTimer.current) clearInterval(pollTimer.current);
    pollTimer.current = setInterval(async () => {
      try {
        const data = await getWPTokenList();
        const ok = Array.isArray(data?.results) && data.results.length > 0;
        if (ok) {
          setConnected(true);
          clearInterval(pollTimer.current);
          try {
            popupRef.current?.close?.();
          } catch {}
          return;
        }
      } catch {}
      if (popupRef.current && popupRef.current.closed) {
        clearInterval(pollTimer.current);
      }
    }, 700);
  };

  // 클릭 직후 팝업 열고 XHR로 URL 받아 이동
  const handleClick = async () => {
    setError('');
    setStarting(true);

    // 1️⃣ 브라우저 팝업 차단 방지용 빈 페이지 먼저 열기
    popupRef.current = window.open('', 'wp_oauth', 'popup=yes,width=560,height=720');

    try {
      // 2️⃣ 인증된 XHR로 OAuth URL 받아오기
      const authUrl = await fetchWPAuthorizeUrl();
      // 3️⃣ 팝업 위치 이동
      popupRef.current.location = authUrl;
    } catch (xhrErr) {
      console.error('Failed to fetch OAuth URL:', xhrErr);
      setError('WordPress OAuth 시작 실패');
      try {
        popupRef.current?.close?.();
      } catch {}
    } finally {
      // 4️⃣ 폴링 시작
      startPolling();
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
      <span
        className={`inline-flex items-center rounded-lg px-3 py-2 bg-emerald-100 text-emerald-700 text-sm ${className}`}
      >
        WordPress connected
      </span>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={handleClick}
        disabled={starting}
        className="rounded-lg px-4 py-2 bg-gray-900 text-white"
      >
        {starting ? 'Connecting...' : 'Connect WordPress'}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}

WordPressLoginButton.propTypes = {
  className: PropTypes.string,
};
