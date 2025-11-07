// src/components/buttons/WordPressLoginButton.jsx
import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { getWPTokenList, fetchWPAuthorizeUrl } from '../../api/wordpress';

/**
 * 흐름
 * 1) 마운트 시 /wordpress/wordpress-tokens/ 조회 -> connected 판단
 * 2) "Connect WordPress" 클릭
 *     2-1) XHR로 /wordpress/oauth/login/ 호출해 auth_url 수신 → 팝업 이동
 * 3) 팝업 열려 있는 동안 700ms 간격으로 토큰 목록 폴링
 * 4) 토큰 저장 확인 시 Connected로 전환, 팝업 닫기
 */
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
      } catch {
        // 무시하고 계속 폴링
      }
      if (popupRef.current && popupRef.current.closed) {
        clearInterval(pollTimer.current);
      }
    }, 700);
  };

  // 팝업 오픈 유틸
  const openPopup = (url) => {
    const w = 560;
    const h = 720;
    const y = window.top.outerHeight / 2 + window.top.screenY - h / 2;
    const x = window.top.outerWidth / 2 + window.top.screenX - w / 2;
    popupRef.current = window.open(
      url,
      'wp_oauth',
      `popup=yes,width=${w},height=${h},left=${x},top=${y}`,
    );
  };

  // OAuth 시작
  const handleClick = async () => {
    setError('');
    setStarting(true);

    // 클릭 직후 팝업 먼저 열기 (브라우저 팝업 차단 방지)
    popupRef.current = window.open('', 'wp_oauth', `popup=yes,width=560,height=720`);

    try {
      const authUrl = await fetchWPAuthorizeUrl();
      openPopup(authUrl);
      startPolling();
    } catch (xhrErr) {
      setError(xhrErr?.message || 'Failed to start WordPress OAuth');
      startPolling();
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
