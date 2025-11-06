// src/components/buttons/WordPressLoginButton.jsx
import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { getWPTokenList, saveWPToken, getWPOAuthStartUrl } from '../../api/wordpress';

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

  // 최초 연결상태 확인
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

    // 팝업 postMessage 수신 (선택: 콜백 쪽에서 코드 전달 시)
    const onMessage = async (ev) => {
      // 같은 오리진만 신뢰
      if (ev.origin !== window.location.origin) return;
      const msg = ev.data;
      if (!msg || typeof msg !== 'object') return;
      if (msg.type === 'WP_CODE') {
        // 백엔드 콜백이 이미 토큰 저장을 끝내도록 구현되어 있다면,
        // 여기서는 토큰이 생겼는지만 곧바로 재확인
        try {
          const d = await getWPTokenList();
          const ok = Array.isArray(d?.results) && d.results.length > 0;
          if (ok) {
            setConnected(true);
            try { popupRef.current?.close?.(); } catch {}
            if (pollTimer.current) clearInterval(pollTimer.current);
          }
        } catch {}
      }
    };

    window.addEventListener('message', onMessage);

    // 정리
    return () => {
      mounted = false;
      window.removeEventListener('message', onMessage);
      if (pollTimer.current) clearInterval(pollTimer.current);
      try { popupRef.current?.close?.(); } catch {}
    };
  }, []);

  // 토큰 폴링: 콜백에서 저장 완료될 때까지 주기 확인
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
      // 팝업이 사용자가 닫아버리면 중단
      if (popupRef.current && popupRef.current.closed) {
        clearInterval(pollTimer.current);
      }
    }, 700);
  };

  const handleClick = async () => {
    setError('');
    setStarting(true);
    try {
      const authUrl = getWPOAuthStartUrl(); // 문자열 조립만, 네트워크 호출 금지
      const w = 560;
      const h = 720;
      const y = window.top.outerHeight / 2 + window.top.screenY - h / 2;
      const x = window.top.outerWidth / 2 + window.top.screenX - w / 2;

      // 팝업은 "우리 서버 로그인 엔드포인트"를 연다.
      // 서버는 302로 WordPress authorize로 리다이렉트 → CORS 비검사 네비게이션.
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
