import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { useState } from "react";

function LogDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [log, setLog] = useState({
    id,
    title: "Dive",
    site: "Sea",
    date: "2025-05-17",
    depth: "20m",
    time: "30min",
    weather: "Clear",
    temperature: "24°C",
    equipment: "Standard scuba gear",
    mood: "Excited",
    notes: "Saw a beautiful coral reef!",
  });

  const handleDelete = () => {
    const confirmDelete = window.confirm("정말 이 로그를 삭제하시겠습니까?");
    if (confirmDelete) {
      console.log(`Log ${log.id} deleted`);
      navigate("/mypage");
    }
  };

  // ESLint 경고 방지용 상태 업데이트 예제
  const updateMood = () => {
    setLog({ ...log, mood: "Relaxed" });
    console.log("Mood updated to Relaxed");
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6 space-y-4">
        <h1 className="text-2xl font-bold text-blue-700 mb-2">Dive Log Detail</h1>
        <p className="text-sm text-gray-500">Log ID: {log.id}</p>
        <div className="space-y-2 text-gray-700">
          <p><strong>Title:</strong> {log.title}</p>
          <p><strong>Site:</strong> {log.site}</p>
          <p><strong>Date:</strong> {log.date}</p>
          <p><strong>Max Depth:</strong> {log.depth}</p>
          <p><strong>Bottom Time:</strong> {log.time}</p>
          <p><strong>Weather:</strong> {log.weather}</p>
          <p><strong>Water Temperature:</strong> {log.temperature}</p>
          <p><strong>Equipment:</strong> {log.equipment}</p>
          <p><strong>Mood:</strong> {log.mood}</p>
          <p><strong>Notes:</strong> {log.notes}</p>
        </div>

        <button
          onClick={handleDelete}
          className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
        >
          🗑️ Delete Log
        </button>

        <button
          onClick={updateMood}
          className="w-full mt-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
        >
          😌 Change Mood to Relaxed
        </button>
      </div>
    </Layout>
  );
}

export default LogDetailPage;


