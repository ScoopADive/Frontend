import Layout from "../components/layout/Layout";

function HomePage() {
  const topMembers = ["Ruby", "Jun", "Alex"];
  const topSpots = ["Bali, Indonesia", "Jeju, Korea", "Sipadan, Malaysia"];
  const jobList = ["Sydney - Australia", "Cebu - Philippines", "Maldives"];

  return (
    <Layout>
      <div className="flex justify-between items-start gap-12">
        {/* 중앙 피드 (향후 타 유저 피드 자리) */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-600 mb-4">Community Feed (준비 중)</h2>
          <div className="bg-gray-100 h-[200px] rounded-xl" />
        </div>

        {/* 오른쪽 사이드 정보 박스 */}
        <div className="w-[400px] space-y-6">
          {/* Top-Level Members */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">👑 Top-Level Members</h3>
            <ul className="list-decimal list-inside text-gray-700">
              {topMembers.map((name, idx) => (
                <li key={idx}>{name}</li>
              ))}
            </ul>
          </div>

          {/* Most Visited Spots */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">📍 The Most Visited Spots</h3>
            <ul className="list-decimal list-inside text-gray-700">
              {topSpots.map((spot, idx) => (
                <li key={idx}>{spot}</li>
              ))}
            </ul>
          </div>

          {/* Jobs */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">🛟 Jobs</h3>
            <ul className="list-disc list-inside text-gray-700">
              {jobList.map((job, idx) => (
                <li key={idx}>{job}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default HomePage;

