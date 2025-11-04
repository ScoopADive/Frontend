// src/components/buttons/WordPressPublishButton.jsx
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getWPTokenList, publishLogbookToWP } from '../../api/wordpress';

function pickUrl(res) {
  if (!res) return '';
  const cands = [
    res.url, res.post_url, res.link, res.permalink,
    res?.data?.url, res?.data?.post_url, res?.data?.link, res?.data?.permalink,
  ];
  return cands.find((v) => typeof v === 'string' && v.startsWith('http')) || '';
}

export default function WordPressPublishButton({ logbookId, className = '', onPublished }) {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [postUrl, setPostUrl] = useState('');
  const [resp, setResp] = useState(null);

  const siteEnv =
    typeof import.meta !== 'undefined'
      ? import.meta.env?.VITE_WP_SITE_URL
      : process.env.REACT_APP_WP_SITE_URL;
  const siteUrl = typeof siteEnv === 'string' ? siteEnv.replace(/\/+$/, '') : '';

  const checkConnection = async () => {
    setLoading(true);
    try {
      const data = await getWPTokenList();
      const has = Array.isArray(data?.results) && data.results.length > 0;
      setConnected(has);
    } catch {
      setConnected(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    checkConnection();
    const onFocus = () => mounted && checkConnection();
    window.addEventListener('visibilitychange', onFocus);
    window.addEventListener('focus', onFocus);
    return () => {
      mounted = false;
      window.removeEventListener('visibilitychange', onFocus);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  const onPublish = async () => {
    if (!connected || publishing) return;
    setPublishing(true);
    setError('');
    setDone(false);
    setPostUrl('');
    setResp(null);
    try {
      const res = await publishLogbookToWP(logbookId);
      setResp(res || null);
      const url = pickUrl(res);
      if (url) setPostUrl(url);
      setDone(true);
      if (onPublished) onPublished(res);
    } catch (e) {
      const status = e?.response?.status;
      const detail = e?.response?.data?.detail || e?.message || 'Publish failed';
      if (status === 401 || status === 403) {
        setConnected(false);
        setError('Connect WordPress first');
      } else {
        setError(detail);
      }
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <button className={`rounded-lg px-4 py-2 bg-gray-200 text-gray-700 ${className}`} disabled>
        Checking WordPress...
      </button>
    );
  }

  if (!connected) {
    return <span className={`text-sm text-gray-600 ${className}`}>Connect WordPress to publish</span>;
  }

  const genericPostsUrl = 'https://wordpress.com/posts';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button onClick={onPublish} disabled={publishing} className="rounded-lg px-4 py-2 bg-indigo-600 text-white">
        {publishing ? 'Publishing...' : 'Publish to WordPress'}
      </button>

      {done && !error ? (
        postUrl ? (
          <a href={postUrl} target="_blank" rel="noreferrer" className="text-sm text-emerald-700 underline">
            View post
          </a>
        ) : (
          <>
            {siteUrl ? (
              <a href={`${siteUrl}/`} target="_blank" rel="noreferrer" className="text-sm text-emerald-700 underline">
                Open blog
              </a>
            ) : null}
            <a
              href={siteUrl ? `${siteUrl}/wp-admin/edit.php` : genericPostsUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-emerald-700 underline"
            >
              Posts
            </a>
          </>
        )
      ) : null}

      {error ? <span className="text-sm text-red-600">{error}</span> : null}
    </div>
  );
}

WordPressPublishButton.propTypes = {
  logbookId: PropTypes.number.isRequired,
  className: PropTypes.string,
  onPublished: PropTypes.func,
};
