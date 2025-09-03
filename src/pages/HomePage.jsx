import { useEffect, useState } from 'react';
import api from '../api/axios';
import Layout from '../components/layout/Layout';
import InfoCard from '../components/cards/InfoCard';
import PostCard from '../components/cards/PostCard';

function HomePage() {
  const [usersMap, setUsersMap] = useState({});
  const [communityPosts, setCommunityPosts] = useState([]);
  const [topMembers, setTopMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // 1️⃣ 사용자 정보
        const usersRes = await api.get('/mypage/all/');
        const users = Array.isArray(usersRes.data) ? usersRes.data : [];
        const map = {};
        users.forEach((user) => (map[user.id] = user.username));
        setUsersMap(map);

        // 2️⃣ 로그북 + 상위 멤버
        const [logbooksRes, topMembersRes] = await Promise.all([
          api.get('/logbooks/'),
          api.get('/home/top_level_members'),
        ]);

        const logbooks =
          Array.isArray(logbooksRes.data.results) && logbooksRes.data.results.length > 0
            ? logbooksRes.data.results
            : [];

        setCommunityPosts(logbooks);
        setTopMembers(Array.isArray(topMembersRes.data) ? topMembersRes.data : []);
      } catch (err) {
        console.error('Failed to fetch home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) return <p className="text-center mt-8">Loading...</p>;
  if (!communityPosts.length) return <p className="text-center mt-8">No data found.</p>;

  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between gap-8">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-blue-700 mb-6">🌊 Community Feed</h2>
          <div className="flex flex-col gap-6">
            {communityPosts.map((post) => (
              <PostCard key={post.id} post={post} usersMap={usersMap} />
            ))}
          </div>
        </div>

        <div className="w-full md:w-[380px] space-y-6 shrink-0">
          <InfoCard title="Top-Level Members" icon="👑" items={topMembers} ordered />
        </div>
      </div>
    </Layout>
  );
}

export default HomePage;
