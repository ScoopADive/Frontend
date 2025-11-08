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

  // 연결 상태 초기 확인
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

    // 팝업 → 부모창 postMessage 수신
    const onMessage = async (ev) => {
      const msg = ev.data;
      if (!msg || typeof msg !== 'object') return;

      // ⚠️ API 서버(origin)가 프론트 origin이랑 다를 수 있어서
      // ev.origin === window.location.origin 체크는 제거.
      // 내부 서비스라 보안보다는 동작 우선.

      if (msg.type === 'WP_CODE' || msg.type === 'WP_OAUTH_DONE' || msg.wordpressConnected) {
        try {
          const d = await getWPTokenList();
          const ok = Array.isArray(d?.results) && d.results.length > 0;
          if (ok) {
            setConnected(true);
          }
        } catch {
          // ignore
        } finally {
          try {
            popupRef.current?.close?.();
          } catch {}
          if (pollTimer.current) {
            clearInterval(pollTimer.current);
            pollTimer.current = null;
          }
        }
      }
    };

    window.addEventListener('message', onMessage);

    return () => {
      mounted = false;
      window.removeEventListener('message', onMessage);
      if (pollTimer.current) {
        clearInterval(pollTimer.current);
        pollTimer.current = null;
      }
      try {
        popupRef.current?.close?.();
      } catch {}
    };
  }, []);

  // 토큰 폴링 (백업 플랜 + 팝업 닫힌 후에도 마지막 한 번은 확인)
  const startPolling = () => {
    if (pollTimer.current) clearInterval(pollTimer.current);

    const startedAt = Date.now();
    const TIMEOUT_MS = 15000; // 최대 15초까지만 폴링

    pollTimer.current = setInterval(async () => {
      const popup = popupRef.current;

      // 시간 초과 시 종료
      if (Date.now() - startedAt > TIMEOUT_MS) {
        clearInterval(pollTimer.current);
        pollTimer.current = null;
        return;
      }

      // ✅ 매 루프마다 먼저 토큰 확인 시도
      try {
        const data = await getWPTokenList();
        const ok = Array.isArray(data?.results) && data.results.length > 0;
        if (ok) {
          setConnected(true);
          clearInterval(pollTimer.current);
          pollTimer.current = null;
          try {
            popup?.close?.();
          } catch {}
          return;
        }
      } catch {
        // ignore: 다음 루프에서 다시 시도
      }

      // 팝업이 이미 닫힌 경우:
      // 이전에는 여기서 바로 return 해서 토큰을 다시 안 봤는데,
      // 위에서 이미 한 번 확인하고 왔으므로 이제 그냥 종료만 해도 됨.
      if (!popup || popup.closed) {
        clearInterval(pollTimer.current);
        pollTimer.current = null;
        return;
      }
    }, 700);
  };

  const handleClick = async () => {
    setError('');
    setStarting(true);
    try {
      // JWT가 없으면 여기서 에러를 던져 팝업 자체를 막는다.
      const authUrl = getWPOAuthStartUrl({ requireAuth: true }); // 쿼리에 state/token(JWT) 포함 (URL-safe)
      const w = 560;
      const h = 720;
      const y = window.top.outerHeight / 2 + window.top.screenY - h / 2;
      const x = window.top.outerWidth / 2 + window.top.screenX - w / 2;

      popupRef.current = window.open(
        authUrl,
        'wp_oauth',
        `popup=yes,width=${w},height=${h},left=${x},top=${y}`
      );

      if (!popupRef.current) {
        // 팝업 차단된 경우
        setError('Popup was blocked. Please allow popups for this site.');
        setStarting(false);
        return;
      }

      popupRef.current.focus?.();

      // postMessage가 오든 안 오든, 백업용 폴링도 함께 돌림
      startPolling();
    } catch (e) {
      if (e && e.code === 'NO_JWT') {
        setError('Please sign in first'); // 로그인 상태가 아니면 안내
      } else {
        setError('Failed to start WordPress OAuth');
      }
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
        expires_at: null,
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
      <button
        className={`rounded-lg px-4 py-2 bg-gray-200 text-gray-700 ${className}`}
        disabled
      >
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
      <button
        onClick={() => setManualOpen(true)}
        className="rounded-lg px-3 py-2 border text-sm"
      >
        Enter token
      </button>
      {error ? <span className="text-xs text-red-600">{error}</span> : null}

      {manualOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 space-y-3">
            <div className="text-base font-semibold">Paste access token</div>
            <input
              value={manualToken}
              onChange={(e) => setManualToken(e.target.value)}
              placeholder="access_token"
              className="w-full border rounded-lg px-3 py-2"
            />
            <input
              value={manualRefresh}
              onChange={(e) => setManualRefresh(e.target.value)}
              placeholder="refresh_token (optional)"
              className="w-full border rounded-lg px-3 py-2"
            />
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setManualOpen(false)}
                className="border rounded-lg px-3 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleManualSave}
                className="bg-indigo-600 text-white rounded-lg px-4 py-2"
              >
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
  className: PropTypes.string,
};
