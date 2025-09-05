import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Layout from '../components/layout/Layout';
import InfoCard from '../components/cards/InfoCard';
import DiveLogCard from '../components/cards/DiveLogCard';

function HomePage() {
  const [usersMap, setUsersMap] = useState({});
  const [communityPosts, setCommunityPosts] = useState([]);
  const [topMembers, setTopMembers] = useState([]);
  const [theMostVisitedSpots, setTheMostVisitedSpots] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // 모달 관련 상태
  const [modalOpen, setModalOpen] = useState(false);
  const [newJob, setNewJob] = useState({ title: '', location: '', description: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // 유저 맵 로딩
        const usersRes = await api.get('/mypage/all/');
        const users = Array.isArray(usersRes.data) ? usersRes.data : [];
        const map = {};
        users.forEach((u) => (map[u.id] = u.username));
        setUsersMap(map);

        // 로그, topMembers, spots, jobs 병렬 요청
        const [logsRes, topMembersRes, spotsRes, jobsRes] = await Promise.all([
          api.get('/logbooks/'),
          api.get('/home/top_level_members'),
          api.get('/home/the_most_visited_spots'),
          api.get('/home/jobs/'),
        ]);

        // 로그 초기화, likes_count 포함
        const logsWithLikes = (logsRes.data.results || []).map((log) => ({
          ...log,
          likes_count: log.likes?.length || 0,
          liked_by_current_user: log.liked_by_current_user || false,
        }));
        setCommunityPosts(logsWithLikes);

        setTopMembers(
          Array.isArray(topMembersRes.data)
            ? topMembersRes.data.map(([name, count]) => ({ name, count }))
            : [],
        );

        setTheMostVisitedSpots(
          Array.isArray(spotsRes.data)
            ? spotsRes.data.map(([locationStr, count]) => {
                const parts = locationStr.split(',').map((s) => s.trim());
                const country = parts.pop();
                const location = parts.join(', ');
                return { location, country, count };
              })
            : [],
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

  // 좋아요 토글 시 communityPosts 상태 업데이트
  const handleLikeUpdate = (logId, liked, likesCount) => {
    setCommunityPosts((prev) =>
      prev.map((log) =>
        log.id === logId ? { ...log, liked_by_current_user: liked, likes_count: likesCount } : log,
      ),
    );
  };

  // Job 생성
  const handleCreateJob = async () => {
    if (!newJob.title || !newJob.location || !newJob.description) return;
    try {
      setCreating(true);
      const res = await api.post('/home/jobs/', newJob);
      setJobs((prev) => [...prev, res.data]);
      setModalOpen(false);
      setNewJob({ title: '', location: '', description: '' }); // 입력 초기화
    } catch (err) {
      console.error('Failed to create job:', err);
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <p className="text-center mt-8">Loading...</p>;

  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between gap-8">
        {/* Left Column */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-blue-700 mb-6">🌊 Community Feed</h2>
          <div className="flex flex-col gap-6">
            {communityPosts.map((log) => (
              <DiveLogCard
                key={log.id}
                log={log}
                usersMap={usersMap}
                onLikeUpdate={handleLikeUpdate}
              />
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col space-y-6">
          <div className="w-full md:w-[380px] shrink-0">
            <InfoCard title="Top-Level Members" icon="👑" items={topMembers} ordered />
          </div>
          <div className="w-full md:w-[380px] shrink-0">
            <InfoCard
              title="The Most Visited Spots"
              icon="📍"
              items={theMostVisitedSpots}
              ordered
            />
          </div>

          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-800">💼 Bulletin</h3>
              <button
                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm transition-colors"
                onClick={() => setModalOpen(true)}
              >
                + Create
              </button>
            </div>
            {jobs.length > 0 ? (
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {jobs.map((job) => (
                  <li key={job.id}>
                    <Link to={`/home/jobs/${job.id}`} className="text-blue-600 hover:underline">
                      {job.title} - {job.location} ({usersMap[job.user] ?? 'Unknown'})
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No bulletin available.</p>
            )}
          </div>
        </div>
      </div>

      {/* 모달 */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-lg p-6 w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4">Create New Bulletin</h3>

            <input
              type="text"
              placeholder="Title"
              className={`w-full mb-2 border rounded px-2 py-1 ${
                !newJob.title && creating ? 'border-red-500' : 'border-gray-300'
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
              className={`w-full mb-2 border rounded px-2 py-1 ${
                !newJob.location && creating ? 'border-red-500' : 'border-gray-300'
              }`}
              value={newJob.location}
              onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
            />
            {!newJob.location && creating && (
              <p className="text-red-500 text-xs mb-2">Location is required</p>
            )}

            <textarea
              placeholder="Description"
              className={`w-full mb-2 border rounded px-2 py-1 ${
                !newJob.description && creating ? 'border-red-500' : 'border-gray-300'
              }`}
              value={newJob.description}
              onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
            />
            {!newJob.description && creating && (
              <p className="text-red-500 text-xs mb-2">Description is required</p>
            )}

            <div className="flex justify-end gap-2 mt-2">
              <button
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 transition-colors"
                onClick={() => {
                  setModalOpen(false);
                  setNewJob({ title: '', location: '', description: '' }); // 초기화
                }}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
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

export default HomePage;
