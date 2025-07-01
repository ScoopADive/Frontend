import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
// import logService from "../services/logService"; // 실제 연결 시 사용

function LogDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [log, setLog] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  const formFields = [
    ["dive_title", "Title"],
    ["dive_site", "Site"],
    ["dive_date", "Date"],
    ["max_depth", "Max Depth (m)"],
    ["bottom_time", "Bottom Time"],
    ["weather", "Weather"],
    ["type_of_dive", "Type of Dive"],
    ["equipment", "Equipment (comma separated)"],
    ["weight", "Weight (kg)"],
    ["start_pressure", "Start Pressure"],
    ["end_pressure", "End Pressure"],
    ["dive_center", "Dive Center (ID)"],
    ["buddy", "Buddy (User ID)"],
    ["feeling", "Feeling"]
  ];

  useEffect(() => {
    const fetchLog = async () => {
      try {
        // 더미 데이터로 테스트
        const dummy = {
          dive_title: "Test Dive",
          dive_site: "Jeju Island",
          dive_date: "2025-06-30",
          max_depth: 18,
          bottom_time: "45:00",
          weather: "Sunny",
          type_of_dive: "Fun",
          equipment: ["BCD", "Mask", "Fins"],
          weight: 4,
          start_pressure: 200,
          end_pressure: 50,
          dive_center: 1,
          buddy: 2,
          feeling: "Amazing!",
          dive_image: null,
        };
        setLog(dummy);
        setForm(dummy);
        setImagePreview(dummy.dive_image || null);
      } catch (err) {
        alert("❌ 로그 정보를 불러오지 못했습니다");
        navigate("/mypage");
      }
    };
    fetchLog();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm("정말 이 로그를 삭제하시겠습니까?")) return;
    try {
      // await logService.deleteLog(id);
      alert("✅ 로그가 삭제되었습니다 (실제 요청은 주석 처리됨)");
      navigate("/mypage");
    } catch (err) {
      alert("❌ 로그 삭제에 실패했습니다");
    }
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, dive_image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();

      // equipment 배열 처리
      if (form.equipment) {
        const eqList = typeof form.equipment === "string"
          ? form.equipment.split(",").map((e) => e.trim())
          : form.equipment;
        eqList.forEach((eq) => formData.append("equipment", eq));
      }

      // 나머지 필드 처리
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== "" && key !== "equipment") {
          if (key === "buddy") {
            formData.append("buddy", `/users/${value}/`);
          } else if (key === "dive_center") {
            formData.append("dive_center", `/dive-centers/${value}/`);
          } else {
            formData.append(key, value);
          }
        }
      });

      // const result = await logService.updateLog(id, formData);
      // setLog(result);
      alert("✅ 수정 완료 (실제 요청은 주석 처리됨)");
      setIsEditing(false);
    } catch (err) {
      alert("❌ 수정 실패: " + (err.response?.data?.detail || err.message));
    }
  };

  if (!log) {
    return (
      <Layout>
        <div className="text-center mt-10 text-gray-500">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-700 mb-2">Dive Log Detail</h1>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="text-sm text-blue-600 underline">
              ✏️ Edit Log
            </button>
          )}
        </div>

        <p className="text-sm text-gray-500">Log ID: {id}</p>

        {imagePreview && <img src={imagePreview} alt="Preview" className="w-full rounded" />}
        {isEditing && (
          <input type="file" accept="image/*" onChange={handleFileChange} className="w-full mb-2" />
        )}

        <div className="space-y-2 text-gray-700">
          {formFields.map(([key, label]) => (
            <p key={key}>
              <strong>{label}:</strong>{" "}
              {isEditing ? (
                <input
                  type={key === "dive_date" ? "date" : "text"}
                  className="border px-2 py-1 rounded w-full"
                  value={form[key] || ""}
                  onChange={handleChange(key)}
                />
              ) : (
                Array.isArray(log[key]) ? log[key].join(", ") : log[key] ?? "없음"
              )}
            </p>
          ))}
        </div>

        {isEditing ? (
          <div className="flex gap-2">
            <button onClick={handleUpdate} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">💾 Save</button>
            <button onClick={() => setIsEditing(false)} className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded">Cancle</button>
          </div>
        ) : (
          <button
            onClick={handleDelete}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
          >
            🗑️ Delete Log
          </button>
        )}
      </div>
    </Layout>
  );
}

export default LogDetailPage;

