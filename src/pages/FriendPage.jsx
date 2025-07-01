import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import LogCard from "../components/cards/LogCard";
import userService from "../services/userService";

function FriendPage() {
  const { id } = useParams(); // URL에서 친구 ID 추출
  const navigate = useNavigate();

  const [friendInfo, setFriendInfo] = useState(null);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchFriend = async () => {
      try {
        const data = await userService.getFriendDetail(id); // API 호출
        setFriendInfo(data);
        setLogs([
          {
            title: "Bali Dive",
            site: "Tulamben",
            date: "2025-04-10",
            depth: "26m",
            bottomTime: "45min",
          },
        ]);
      } catch (err) {
        console.error("❌ 친구 정보 불러오기 실패", err);
        alert("친구 정보를 불러오지 못했습니다.");
        navigate("/mypage");
      }
    };

    fetchFriend();
  }, [id, navigate]);

  if (!friendInfo) {
    return (
      <Layout>
        <div className="text-center mt-10 text-gray-500">Loading friend info...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Friend @{friendInfo.username}&apos;s Dive Logs
          </h1>
          <button
            onClick={() => navigate(`/chat/${friendInfo.username}`)}
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
