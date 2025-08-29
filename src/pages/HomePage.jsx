import { useEffect, useState } from 'react';
import api from '../api/axios';
import Layout from '../components/layout/Layout';
import InfoCard from '../components/cards/InfoCard';
import PostCard from '../components/cards/PostCard';

function HomePage() {
  const [data, setData] = useState({
    community_posts: [],
    top_members: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ 로그북과 상위 멤버 가져오기
        const [logbooksRes, topMembersRes, usersRes] = await Promise.all([
          api.get('/logbooks/'),
          api.get('/home/top_level_members'),
          api.get('/users/'), // 모든 사용자 정보 가져오기
        ]);

        const logbooks = Array.isArray(logbooksRes.data.results) ? logbooksRes.data.results : [];
        const usersMap = {};
        if (Array.isArray(usersRes.data)) {
          usersRes.data.forEach((user) => {
            usersMap[user.id] = user.username; // id → username 매핑
          });
        }

        // 2️⃣ 각 로그북의 좋아요 수 가져오기
        const logbooksWithExtras = await Promise.all(
          logbooks.map(async (log) => {
            let likes = [];
            try {
              const likeRes = await api.get(`/logbooks/${log.id}/get_like/`);
              likes = Array.isArray(likeRes.data) ? likeRes.data : [];
            } catch (err) {
              console.error(`Failed to fetch likes for logbook ${log.id}`, err);
            }

            return {
              ...log,
              user_username: usersMap[log.user] || `user${log.user}`, // username 추가
              likes_count: likes.length,
              likes,
            };
          }),
        );

        setData({
          community_posts: logbooksWithExtras,
          top_members: Array.isArray(topMembersRes.data) ? topMembersRes.data : [],
        });
      } catch (err) {
        console.error('Error fetching home page data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="text-center mt-8">Loading...</p>;
  if (!data || data.community_posts.length === 0)
    return <p className="text-center mt-8">No data found.</p>;

  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between gap-8">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-blue-700 mb-6">🌊 Community Feed</h2>

          <div className="flex flex-col gap-6">
            {data.community_posts.map((post) => (
              <div key={post.id} className="border rounded-lg p-4">
                {/* 제목과 작성자 */}
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-2">
                  {post.dive_title}
                  <span className="text-xs text-gray-400">@{post.user_username}</span>
                </h3>

                <PostCard post={post} />

                <div className="post-footer flex justify-between mt-2 text-sm text-gray-500">
                  <span>👍 {post.likes_count} Likes</span>
                  {/* 댓글 수는 필요하면 여기 추가 */}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full md:w-[380px] space-y-6 shrink-0">
          <InfoCard title="Top-Level Members" icon="👑" items={data.top_members} ordered />
        </div>
      </div>
    </Layout>
  );
}

export default HomePage;
