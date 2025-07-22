import Layout from "../components/layout/Layout";
import InfoCard from "../components/cards/InfoCard";
import PostCard from "../components/cards/PostCard";
import FriendSuggestionCard from "../components/cards/FriendSuggestionCard";

function HomePage() {
  const topMembers = ["Ruby", "Jun", "Alex"];
  const topSpots = ["Bali, Indonesia", "Jeju, Korea", "Sipadan, Malaysia"];
  const jobList = ["Sydney - Australia", "Cebu - Philippines", "Maldives"];
  const recentActivity = [
    "Liked Ruby's dive log",
    "Commented on Alex's post",
    "Added log at Cebu",
  ];
  const friendSuggestions = [
    "Emma (5 logs this month)",
    "Leo (dives in Jeju often)",
    "Nina (just joined!)",
  ];

  const popularPosts = [
    {
      user: "Emma",
      imageUrl: "https://source.unsplash.com/featured/?diving,tulum",
      action: "shared a dive log from Tulum, Mexico",
      feeling: "Met 3 sea turtles and saw the cenote light rays 🐢✨",
      time: "2 days ago",
      likes: 146,
      comments: 42,
      views: 682,
    },
  ];

  const communityPosts = [
    {
      user: "Jun",
      imageUrl: "https://source.unsplash.com/featured/?diving,certification",
      action: "earned Advanced OW certification",
      feeling: "Feeling proud and ready for more 🏅",
      time: "3h ago",
    },
    {
      user: "Alex",
      imageUrl: "https://source.unsplash.com/featured/?diving,comment",
      action: "commented on Ruby's dive log",
      feeling: "Great dive! I want to visit there too 🐟",
      time: "5h ago",
    },
  ];

  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between gap-8">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-blue-700 mb-6">🌊 Community Feed</h2>

          {popularPosts.length > 0 && (
            <div className="mb-8">
              <h3 className="text-md font-semibold text-orange-500 mb-2">🔥 Top Trending Dive</h3>
              <PostCard post={popularPosts[0]} isPopular />
            </div>
          )}

          <div className="flex flex-col gap-6">
            {communityPosts.map((post, idx) => (
              <PostCard key={idx} post={post} />
            ))}
          </div>
        </div>

        <div className="w-full md:w-[380px] space-y-6 shrink-0">
          <InfoCard title="Top-Level Members" icon="👑" items={topMembers} ordered />
          <InfoCard title="My Recent Activity" icon="🧾" items={recentActivity} />
          <InfoCard title="The Most Visited Spots" icon="📍" items={topSpots} ordered />
          <InfoCard title="Jobs" icon="🛟" items={jobList} />
          <FriendSuggestionCard suggestions={friendSuggestions} />
        </div>
      </div>
    </Layout>
  );
}

export default HomePage;
