import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import LogCard from "../components/cards/LogCard";

function FriendPage() {
  const { username } = useParams();
  const navigate = useNavigate();

  // 더미 데이터: 친구의 다이빙 로그
  const logs = [
    {
      title: "Bali Dive",
      site: "Tulamben",
      date: "2025-04-10",
      depth: "26m",
      bottomTime: "45min",
    },
  ];

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">{username}'s Dive Logs</h1>
          <button
            onClick={() => navigate(`/chat/${username}`)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            💬 대화 나누기
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {logs.map((log, index) => (
            <LogCard key={index} log={log} />
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default FriendPage;
