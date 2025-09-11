// src/pages/FriendPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import LogCard from "../components/cards/LogCard";
import userService from "../services/userService";

// 추가: 한정 메시지 모달
import MessageComposer from "../components/messages/MessageComposer";

function FriendPage() {
  const { id } = useParams(); // URL에서 친구 ID 추출
  const navigate = useNavigate();

  const [friendInfo, setFriendInfo] = useState(null);
  const [logs, setLogs] = useState([]);

  // 메시지 모달 상태
  const [composerOpen, setComposerOpen] = useState(false);

  useEffect(() => {
    const fetchFriend = async () => {
      try {
        const data = await userService.getFriendDetail(id); // API 호출
        setFriendInfo(data);

        // 데모용 더미 로그. 실제로는 해당 친구의 로그를 API로 불러오면 됨.
        setLogs([
          {
            id: "demo-1",
            title: "Bali Dive",
            site: "Tulamben",
            date: "2025-04-10",
            depth: "26m",
            bottomTime: "45min",
          },
        ]);
      } catch (err) {
        console.error("Failed to fetch friend info", err);
        alert("Failed to load friend info.");
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

  // 모달에 전달할 수신자 정보 구성
  const receiver = {
    // 서버 구조에 따라 id/username 키 확인
    id: friendInfo.id || friendInfo.user_id,
    username: friendInfo.username || friendInfo.name,
    displayName: friendInfo.username || friendInfo.name || "Unknown",
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* 상단 헤더 */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Friend @{friendInfo?.username}&apos;s Dive Logs
          </h1>

          {/* 변경: 채팅 라우트 이동 대신 메시지 모달 오픈 */}
          <button
            onClick={() => setComposerOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Send Message
          </button>
        </div>

        {/* 친구 기본 정보 카드 (선택적, 가볍게 표시) */}
        <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
          <img
            src={
              friendInfo.profile_image ||
              friendInfo.avatar ||
              "https://via.placeholder.com/80"
            }
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="text-lg font-semibold text-gray-800">
              {friendInfo.username || friendInfo.name || "Unknown"}
            </div>
            <div className="text-sm text-gray-500">
              {friendInfo.email || "No email"}
            </div>
            <div className="text-sm text-gray-500">
              License: {friendInfo.license || "-"}
            </div>
          </div>
        </div>

        {/* 로그 목록 */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Recent Logs</h2>
          {(!logs || logs.length === 0) ? (
            <div className="w-full bg-gray-50 border border-dashed border-gray-300 rounded-xl p-6 text-center text-gray-600">
              No logs available.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {logs.map((log) => (
                <LogCard key={log.id || log.title} log={log} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 한정 메시지 작성 모달 */}
      <MessageComposer
        isOpen={composerOpen}
        onClose={() => setComposerOpen(false)}
        defaultReceiver={receiver}
      />
    </Layout>
  );
}

export default FriendPage;
