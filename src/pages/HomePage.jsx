// src/pages/HomePage.jsx
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Layout from '../components/layout/Layout';

/*
  Theme notes
  - Uses the compact layout (small side paddings) but keeps comfortable internal paddings
  - Typography and colors follow the dark-slate primary used in your latest theme
  - Logic is unchanged from your original file
*/

function HomePage() {
  // data states
  const [usersMap, setUsersMap] = useState({});
  const [communityPosts, setCommunityPosts] = useState([]);
  const [topMembers, setTopMembers] = useState([]);
  const [theMostVisitedSpots, setTheMostVisitedSpots] = useState([]);
  const [jobs, setJobs] = useState([]);

  // ui states
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [newJob, setNewJob] = useState({ title: '', location: '', description: '' });
  const [creating, setCreating] = useState(false);

  // dummy recommendations (no API yet)
  const SEASONS = ['Spring', 'Summer', 'Autumn', 'Winter'];
  const SKILLS = ['Beginner', 'Intermediate', 'Advanced', 'Specialty'];

  const DUMMY_SPOTS = useMemo(
    () => [
      {
        id: 1,
        name: 'Jeju - Munseom',
        country: 'Korea',
        highlight: 'Soft coral garden, easy entry',
        seasons: ['Spring', 'Summer'],
        skills: ['Beginner', 'Intermediate'],
      },
      {
        id: 2,
        name: 'Bali - Tulamben',
        country: 'Indonesia',
        highlight: 'USAT Liberty wreck',
        seasons: ['Autumn', 'Winter', 'Summer'],
        skills: ['Beginner', 'Specialty'],
      },
      {
        id: 3,
        name: 'Cebu - Moalboal',
        country: 'Philippines',
        highlight: 'Sardine run near shore',
        seasons: ['Winter', 'Spring'],
        skills: ['Beginner', 'Intermediate'],
      },
      {
        id: 4,
        name: 'Maldives - Ari Atoll',
        country: 'Maldives',
        highlight: 'Manta cleaning station',
        seasons: ['Summer', 'Autumn'],
        skills: ['Intermediate', 'Advanced'],
      },
      {
        id: 5,
        name: 'Okinawa - Kerama',
        country: 'Japan',
        highlight: 'Clear water and white sand',
        seasons: ['Spring', 'Summer'],
        skills: ['Beginner'],
      },
      {
        id: 6,
        name: 'Palau - Blue Corner',
        country: 'Palau',
        highlight: 'Strong currents and pelagics',
        seasons: ['Autumn', 'Winter'],
        skills: ['Advanced', 'Specialty'],
      },
    ],
    []
  );

  const beginnerPicks = useMemo(
    () => DUMMY_SPOTS.filter((s) => s.skills.includes('Beginner')).slice(0, 4),
    [DUMMY_SPOTS]
  );

  const [activeSeason, setActiveSeason] = useState('Spring');
  const [activeSkill, setActiveSkill] = useState('Beginner');

  const seasonalPicks = useMemo(
    () => DUMMY_SPOTS.filter((s) => s.seasons.includes(activeSeason)).slice(0, 6),
    [DUMMY_SPOTS, activeSeason]
  );

  const skillPicks = useMemo(
    () => DUMMY_SPOTS.filter((s) => s.skills.includes(activeSkill)).slice(0, 6),
    [DUMMY_SPOTS, activeSkill]
  );

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const usersRes = await api.get('/mypage/all/');
        const users = Array.isArray(usersRes.data) ? usersRes.data : [];
        const map = {};
        users.forEach((u) => (map[u.id] = u.username));
        setUsersMap(map);

        const [logsRes, topMembersRes, spotsRes, jobsRes] = await Promise.all([
          api.get('/logbooks/'),
          api.get('/home/top_level_members'),
          api.get('/home/the_most_visited_spots'),
          api.get('/home/jobs/'),
        ]);

        const logsWithLikes = (logsRes.data.results || []).map((log) => ({
          ...log,
          likes_count: log.likes?.length || 0,
          liked_by_current_user: log.liked_by_current_user || false,
        }));
        setCommunityPosts(logsWithLikes);

        setTopMembers(
          Array.isArray(topMembersRes.data)
            ? topMembersRes.data.map(([name, count]) => ({ name, count }))
            : []
        );

        setTheMostVisitedSpots(
          Array.isArray(spotsRes.data)
            ? spotsRes.data.map(([locationStr, count]) => ({
                location: locationStr,
                country: '',
                count,
              }))
            : []
        );

        setJobs(jobsRes.data.results || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const handleLikeUpdate = (logId, liked, likesCount) => {
    setCommunityPosts((prev) =>
      prev.map((log) =>
        log.id === logId
          ? { ...log, liked_by_current_user: liked, likes_count: likesCount }
          : log
      )
    );
  };

  const handleCreateJob = async () => {
    if (!newJob.title || !newJob.location || !newJob.description) return;
    try {
      setCreating(true);
      const res = await api.post('/home/jobs/', newJob);
      setJobs((prev) => [...prev, res.data]);
      setModalOpen(false);
      setNewJob({ title: '', location: '', description: '' });
    } catch (err) {
      console.error('Failed to create job:', err);
    } finally {
      setCreating(false);
    }
  };

  const highlight = useMemo(() => {
    const totalLogs = communityPosts.length;
    const topSpot = theMostVisitedSpots[0]?.location || '—';
    const topMember = topMembers[0]?.name || '—';
    return { totalLogs, topSpot, topMember };
  }, [communityPosts.length, theMostVisitedSpots, topMembers]);

  if (loading) return <p className="text-center mt-8">Loading...</p>;

  return (
    <Layout>
      {/* Hero */}
      <section className="relative">
        <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-br from-[#eef1f5] via-[#eef2f7] to-[#e7efff] shadow-[0_4px_16px_rgba(15,23,42,0.05)]">
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center rounded-full bg-white/70 backdrop-blur px-2.5 py-1 text-[11px] font-semibold text-gray-700 border border-white/60 shadow-sm">
              ScoopADive
            </span>
          </div>

          <div className="px-6 md:px-10 py-10 md:py-12">
            <h1 className="text-[34px] md:text-[48px] leading-[1.08] font-extrabold tracking-[-0.02em] text-slate-900">
              Dive Deep,<br className="hidden md:block" /> Share Stories
            </h1>
            <p className="mt-3 max-w-3xl text-[15px] md:text-[16px] leading-relaxed text-slate-600">
              Record your underwater adventures, connect with fellow divers, and discover the
              world's most incredible dive sites.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/log/create"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-5 py-3 text-[15px] font-semibold shadow hover:opacity-95 hover:shadow-md transition"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M4 7h3l1.2-1.8A2 2 0 0 1 9.8 4h4.4a2 2 0 0 1 1.6.8L17 7h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.6"/>
                  <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="1.6"/>
                </svg>
                Start Logging
              </Link>

              <a
                href="#feed"
                className="inline-flex items-center gap-2 rounded-xl bg-white text-slate-900 border border-gray-200 px-5 py-3 text-[15px] font-semibold shadow-sm hover:bg-slate-50 transition"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M7 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3 20v-1a5 5 0 0 1 5-5m8 0a5 5 0 0 1 5 5v1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
                Explore Community
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="pt-10 pb-2">
        <h2 className="text-center text-[28px] md:text-[32px] font-bold text-slate-900">How It Works</h2>
        <p className="mt-1.5 text-center text-slate-500 text-[14px]">
          Simple steps to start documenting your diving journey
        </p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <HowCardCompact step="1" title="Dive" desc="Enjoy your underwater adventure" icon="waves" />
          <HowCardCompact step="2" title="Record" desc="Log depth, time, and conditions" icon="camera" />
          <HowCardCompact step="3" title="Share" desc="Post photos and experiences" icon="users" />
          <HowCardCompact step="4" title="Discover" desc="Find new spots from the community" icon="pin" />
        </div>
      </section>

      {/* Recommended for beginners */}
      <section className="mt-8">
        <div className="rounded-lg bg-white border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-slate-900">Recommended spots for beginners</h3>
              <p className="text-slate-600 mt-1 text-[14px] leading-snug">
                Calm conditions and easy entry sites to start confidently.
              </p>
            </div>
            <Link
              to="/spots"
              className="hidden sm:inline-flex items-center rounded-md border border-gray-200 px-3 py-1.5 text-[13px] font-semibold text-slate-700 hover:bg-gray-50 hover:shadow-sm transition"
            >
              View all
            </Link>
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {beginnerPicks.map((s) => (
              <SpotCard key={s.id} spot={s} tagColor="blue" />
            ))}
          </div>

          <div className="sm:hidden mt-4">
            <Link
              to="/spots"
              className="w-full inline-flex items-center justify-center rounded-md border border-gray-200 px-3 py-1.5 text-[13px] font-semibold text-slate-700 hover:bg-gray-50 hover:shadow-sm transition"
            >
              View all
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Start + Community Stats */}
      <section className="mt-8">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 rounded-lg bg-white border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition p-6">
            <h3 className="text-lg md:text-xl font-bold text-slate-900">Quick Start</h3>
            <p className="text-slate-600 mt-1 text-[14px]">
              New here? Follow these simple steps and create your first log today.
            </p>
            <ol className="mt-4 grid sm:grid-cols-3 gap-3">
              <li className="rounded-md border-2 border-dashed border-gray-300 p-4 bg-gray-50 hover:border-slate-800 transition-colors">
                <p className="text-[12px] font-semibold text-slate-800">Step 1</p>
                <p className="font-medium text-[14px]">Choose your dive site</p>
                <p className="text-[12px] text-slate-600">Search worldwide sites.</p>
              </li>
              <li className="rounded-md border-2 border-dashed border-gray-300 p-4 bg-gray-50 hover:border-slate-800 transition-colors">
                <p className="text-[12px] font-semibold text-slate-800">Step 2</p>
                <p className="font-medium text-[14px]">Add depth and bottom time</p>
                <p className="text-[12px] text-slate-600">Key metrics first.</p>
              </li>
              <li className="rounded-md border-2 border-dashed border-gray-300 p-4 bg-gray-50 hover:border-slate-800 transition-colors">
                <p className="text-[12px] font-semibold text-slate-800">Step 3</p>
                <p className="font-medium text-[14px]">Attach photo and gear</p>
                <p className="text-[12px] text-slate-600">Make it memorable.</p>
              </li>
            </ol>
            <div className="mt-4">
              <Link
                to="/log/create"
                className="inline-flex items-center rounded-md bg-slate-900 text-white px-4 py-2 text-[14px] font-semibold hover:opacity-95 hover:shadow transition"
              >
                Start now
              </Link>
            </div>
          </div>

          {/* Community Stats */}
          <div className="rounded-lg bg-white border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition p-5">
            <h3 className="text-lg md:text-xl font-bold text-slate-900">Diving Stats</h3>
            <ul className="mt-3 space-y-2">
              <li className="flex items-center justify-between px-3 py-2 rounded-md bg-gray-50">
                <span className="text-slate-600 text-[13px]">Skill Level</span>
                <span className="font-bold text-[20px]">{highlight.totalLogs}</span>
              </li>
              <li className="flex items-center justify-between px-3 py-2 rounded-md bg-gray-50">
                <span className="text-slate-600 text-[13px]">Logs Created</span>
                <span className="font-semibold max-w-[160px] truncate text-[14px]">{highlight.topSpot}</span>
              </li>
              <li className="flex items-center justify-between px-3 py-2 rounded-md bg-gray-50">
                <span className="text-slate-600 text-[13px]">Logs Published</span>
                <span className="font-semibold max-w-[160px] truncate text-[14px]">{highlight.topMember}</span>
              </li>
            </ul>
            <a
              href="#feed"
              className="mt-3 block w-full text-center rounded-md border border-gray-200 bg-white text-slate-900 px-4 py-1.5 text-[14px] font-semibold hover:bg-slate-50 hover:shadow transition"
            >
              View Community Feed
            </a>
          </div>
        </div>
      </section>

      {/* Seasonal and Skill recommendations */}
      <section className="mt-8">
        <div className="rounded-lg bg-white border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition p-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-slate-900">Find the right spot for you</h3>
              <p className="text-slate-600 mt-1 text-[14px]">Browse by season or skill level. Beginner-first mindset.</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="px-3 py-1.5 rounded-md border border-gray-200 text-[13px] font-semibold hover:bg-gray-50 hover:shadow-sm transition"
                onClick={() => {
                  setActiveSeason('Spring');
                  setActiveSkill('Beginner');
                }}
              >
                Reset filters
              </button>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {SEASONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setActiveSeason(s)}
                  className={`px-3 py-1.5 rounded-full border text-[13px] font-semibold transition ${
                    activeSeason === s
                      ? 'bg-slate-900 text-white border-slate-900 shadow'
                      : 'bg-white text-slate-700 border-gray-200 hover:bg-gray-50 hover:shadow-sm'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {seasonalPicks.map((s) => (
                <SpotCard key={`season-${s.id}`} spot={s} tagColor="emerald" />
              ))}
            </div>
          </div>

          <div className="mt-8">
            <div className="flex flex-wrap gap-2">
              {SKILLS.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setActiveSkill(lvl)}
                  className={`px-3 py-1.5 rounded-full border text-[13px] font-semibold transition ${
                    activeSkill === lvl
                      ? 'bg-slate-900 text-white border-slate-900 shadow'
                      : 'bg-white text-slate-700 border-gray-200 hover:bg-gray-50 hover:shadow-sm'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {skillPicks.map((s) => (
                <SpotCard key={`skill-${s.id}`} spot={s} tagColor="indigo" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feed */}
      <section id="feed" className="mt-10 mb-10">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Community Feed card */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition border border-gray-200 p-6">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">Community Feed</h2>
              <p className="text-slate-600 text-[14px] mt-1 mb-5">Latest dive logs from the community</p>

              {communityPosts.length === 0 ? (
                <div className="w-full bg-gray-50 border border-dashed border-gray-300 rounded-lg p-10 text-center text-slate-500">
                  No logs yet.
                  <div className="mt-4">
                    <Link
                      to="/log/create"
                      className="inline-flex items-center rounded-md bg-slate-900 text-white px-5 py-2 text-[14px] font-semibold hover:opacity-95 hover:shadow-md transition"
                    >
                      Create your log
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {communityPosts.map((log) => (
                    <FeedItem key={log.id} log={log} usersMap={usersMap} onLikeUpdate={handleLikeUpdate} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right sidebar cards */}
          <aside className="flex flex-col space-y-6">
            <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition border border-gray-200 p-5">
              <h3 className="text-lg md:text-xl font-semibold text-slate-900">Top Divers</h3>
              <ol className="mt-3 space-y-2">
                {topMembers.length === 0 ? (
                  <p className="text-slate-500 text-[13px]">No divers yet.</p>
                ) : (
                  topMembers.map((m, i) => (
                    <li key={`${m.name}-${i}`} className="flex items-center justify-between">
                      <span className="text-slate-800">{i + 1}. {m.name}</span>
                      <span className="text-slate-600 text-[13px]">{m.count} dives</span>
                    </li>
                  ))
                )}
              </ol>
            </div>

            <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition border border-gray-200 p-5">
              <h3 className="text-lg md:text-xl font-semibold text-slate-900">Popular Spots</h3>
              <ol className="mt-3 space-y-2">
                {theMostVisitedSpots.length === 0 ? (
                  <p className="text-slate-500 text-[13px]">No spots yet.</p>
                ) : (
                  theMostVisitedSpots.map((s, i) => (
                    <li key={`${s.location}-${i}`} className="flex items-center justify-between">
                      <span className="text-slate-800">{i + 1}. {s.location}</span>
                      <span className="text-slate-600 text-[13px]">{s.count} visits</span>
                    </li>
                  ))
                )}
              </ol>
            </div>

            <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition border border-gray-200 p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg md:text-xl font-semibold text-slate-900">Community Board</h3>
                <button
                  className="px-4 py-1.5 rounded-md bg-slate-900 text-white text-[13px] font-semibold hover:opacity-90 hover:shadow"
                  onClick={() => setModalOpen(true)}
                >
                  Post
                </button>
              </div>
              <p className="text-slate-500 text-[13px] mt-3">
                {jobs.length > 0 ? 'Latest posts from the community' : 'No posts yet. Be the first to share!'}
              </p>

              {jobs.length > 0 && (
                <div className="mt-3 space-y-2">
                  {jobs.map((job) => (
                    <div key={job.id} className="p-3 rounded-md border hover:shadow-sm transition">
                      <Link to={`/home/jobs/${job.id}`} className="font-medium text-slate-900 hover:underline">
                        {job.title}
                      </Link>
                      <p className="text-[13px] text-slate-600">{job.location}</p>
                      <p className="text-[12px] text-slate-500">by {usersMap[job.user] ?? 'Unknown'}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>

      {/* Bulletin Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 w-[380px] max-w-[92vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-[16px] font-semibold mb-3">Create New Bulletin</h3>

            <input
              type="text"
              placeholder="Title"
              className={`w-full mb-2 border rounded-md px-3 py-2 text-[14px] transition ${
                !newJob.title && creating ? 'border-red-500' : 'border-gray-300 focus:border-slate-900'
              }`}
              value={newJob.title}
              onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
            />
            {!newJob.title && creating && (
              <p className="text-red-500 text-xs mb-2">Title is required</p>
            )}

            <input
              type="text"
              placeholder="Location"
              className={`w-full mb-2 border rounded-md px-3 py-2 text-[14px] transition ${
                !newJob.location && creating ? 'border-red-500' : 'border-gray-300 focus:border-slate-900'
              }`}
              value={newJob.location}
              onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
            />
            {!newJob.location && creating && (
              <p className="text-red-500 text-xs mb-2">Location is required</p>
            )}

            <textarea
              placeholder="Description"
              className={`w-full mb-2 border rounded-md px-3 py-2 text-[14px] transition ${
                !newJob.description && creating ? 'border-red-500' : 'border-gray-300 focus:border-slate-900'
              }`}
              rows={4}
              value={newJob.description}
              onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
            />
            {!newJob.description && creating && (
              <p className="text-red-500 text-xs mb-2">Description is required</p>
            )}

            <div className="flex justify-end gap-2 mt-2">
              <button
                className="px-3 py-1.5 bg-gray-200 rounded-md text-[13px] hover:bg-gray-300 transition-colors"
                onClick={() => {
                  setModalOpen(false);
                  setNewJob({ title: '', location: '', description: '' });
                }}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1.5 bg-slate-900 text-white rounded-md text-[13px] hover:opacity-95 hover:shadow transition-colors"
                onClick={handleCreateJob}
                disabled={creating}
              >
                {creating ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

/* Feed item */
function FeedItem({ log, usersMap, onLikeUpdate }) {
  const author = usersMap[log.user] || usersMap[log.user_id] || 'Unknown';
  const firstLetter = author?.[0]?.toUpperCase() || 'D';
  const title = log.title || log.subject || 'Untitled log';
  const location = log.location || log.site || '—';
  const depth = log.depth || log.max_depth || '—';
  const bottomTime = log.bottom_time || log.time || '—';
  const createdAt = log.created_at || log.date || log.created || new Date().toISOString();
  const likeCount = Number.isFinite(log.likes_count) ? log.likes_count : 0;

  return (
    <div className="rounded-lg border border-gray-200 hover:border-gray-300 p-5 hover:shadow-md transition">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-slate-700 font-semibold">
          {firstLetter}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">{author}</span>
            <span className="text-xs text-slate-500">{new Date(createdAt).toLocaleDateString()}</span>
          </div>
          <p className="mt-1 font-medium text-slate-900">{title}</p>
          <p className="mt-1 text-sm text-slate-600">
            {location !== '—' && <span className="mr-2">at {location}</span>}
            {depth !== '—' && <span className="mr-2">{depth}m</span>}
            {bottomTime !== '—' && <span>{bottomTime}min</span>}
          </p>
          <div className="mt-3 flex items-center gap-4 text-sm">
            <span className="text-slate-700">♥ {likeCount}</span>
            <Link to={`/log/${log.id}`} className="text-slate-900 font-semibold hover:underline">
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* How It Works card */
function HowCardCompact({ step, title, desc, icon }) {
  return (
    <div className="rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md transition p-5 text-center">
      <div className="mx-auto h-10 w-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-[14px] font-bold">
        {step}
      </div>
      <div className="mt-2.5 flex items-center justify-center">
        {icon === 'waves' && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 10c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2" stroke="#0f172a" strokeWidth="1.6" strokeLinecap="round"/>
            <path d="M3 14c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2" stroke="#0f172a" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
        )}
        {icon === 'camera' && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 7h3l1.2-1.8A2 2 0 0 1 9.8 4h4.4a2 2 0 0 1 1.6.8L17 7h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" stroke="#0f172a" strokeWidth="1.6"/>
            <circle cx="12" cy="13" r="4" stroke="#0f172a" strokeWidth="1.6"/>
          </svg>
        )}
        {icon === 'users' && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M7 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="#0f172a" strokeWidth="1.6"/>
            <path d="M3 20v-1a5 5 0 0 1 5-5m8 0a5 5 0 0 1 5 5v1" stroke="#0f172a" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
        )}
        {icon === 'pin' && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 21s7-5.5 7-11.5A7 7 0 1 0 5 9.5C5 15.5 12 21 12 21Z" stroke="#0f172a" strokeWidth="1.6"/>
            <circle cx="12" cy="9.5" r="2.5" stroke="#0f172a" strokeWidth="1.6"/>
          </svg>
        )}
      </div>
      <p className="mt-2 font-semibold text-slate-900">{title}</p>
      <p className="text-[13px] text-slate-500 mt-1">{desc}</p>
    </div>
  );
}

function SpotCard({ spot, tagColor = 'blue' }) {
  const color =
    {
      blue: { bg: 'from-blue-50 to-blue-100', text: 'text-blue-700', border: 'border-blue-100' },
      emerald: { bg: 'from-emerald-50 to-emerald-100', text: 'text-emerald-700', border: 'border-emerald-100' },
      indigo: { bg: 'from-indigo-50 to-indigo-100', text: 'text-indigo-700', border: 'border-indigo-100' },
    }[tagColor] || { bg: 'from-gray-50 to-gray-100', text: 'text-gray-700', border: 'border-gray-200' };

  return (
    <div className="group rounded-lg border border-gray-200 hover:border-gray-300 bg-white shadow-sm hover:shadow-md transition">
      <div className={`h-24 w-full rounded-t-lg bg-gradient-to-br ${color.bg}`} />
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-slate-900 text-[15px]">{spot.name}</h4>
          <span
            className={`ml-2 inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${color.text} ${color.border}`}
          >
            {spot.country}
          </span>
        </div>
        <p className="mt-1 text-[13px] text-slate-600 leading-snug">{spot.highlight}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {spot.seasons.slice(0, 2).map((t) => (
            <span
              key={t}
              className="text-[11px] rounded-full bg-gray-100 text-slate-700 px-2 py-0.5 border border-gray-200"
            >
              {t}
            </span>
          ))}
          {spot.skills.slice(0, 2).map((t) => (
            <span
              key={t}
              className="text-[11px] rounded-full bg-gray-50 text-slate-700 px-2 py-0.5 border border-gray-200"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="mt-2">
          <button
            type="button"
            className="text-[13px] font-semibold text-slate-900 hover:underline hover:opacity-90"
            onClick={() => {}}
          >
            View logs →
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
