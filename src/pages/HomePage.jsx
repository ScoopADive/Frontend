import Layout from "../components/layout/Layout";
import InfoCard from "../components/cards/InfoCard";

function HomePage() {
  const topMembers = ["Ruby", "Jun", "Alex"];
  const topSpots = ["Bali, Indonesia", "Jeju, Korea", "Sipadan, Malaysia"];
  const jobList = ["Sydney - Australia", "Cebu - Philippines", "Maldives"];

  const communityPosts = [
    { user: "Lina", action: "added a new dive log at Jeju 🐠", time: "1h ago" },
    { user: "Jun", action: "earned Advanced OW certification 🎖️", time: "3h ago" },
    { user: "Alex", action: "commented on Ruby's dive log", time: "5h ago" },
  ];

  return (
    <Layout>
      <div className="flex justify-between items-start gap-12">
        {/* 중앙 피드 */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-600 mb-4">🌊 Community Feed</h2>
          <div className="space-y-4">
            {communityPosts.map((post, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow p-4">
                <p className="text-gray-800 font-medium">
                  <span className="text-blue-600">@{post.user}</span> {post.action}
                </p>
                <p className="text-xs text-gray-400 mt-1">{post.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 오른쪽 사이드 정보 박스 */}
        <div className="w-[400px] space-y-6">
          <InfoCard title="Top-Level Members" icon="👑" items={topMembers} ordered />
          <InfoCard title="The Most Visited Spots" icon="📍" items={topSpots} ordered />
          <InfoCard title="Jobs" icon="🛟" items={jobList} />
        </div>
      </div>
    </Layout>
  );
}

export default HomePage;
