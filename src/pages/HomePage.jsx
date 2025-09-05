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

  const handleLikeUpdate = (logId, liked, likesCount) => {
    setCommunityPosts((prev) =>
      prev.map((log) =>
        log.id === logId ? { ...log, liked_by_current_user: liked, likes_count: likesCount } : log,
      ),
    );
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
              <Link
                key={log.id}
                to={`/log/${log.id}`}
                state={{ usersMap }} // usersMap 전달
              >
                <DiveLogCard log={log} usersMap={usersMap} onLikeUpdate={handleLikeUpdate} />
              </Link>
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
        </div>
      </div>
    </Layout>
  );
}

export default HomePage;
