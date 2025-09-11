// src/pages/LogDetailPage.jsx
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Input from "../components/common/Input";
import logService from "../services/logService";
import authService from "../services/authService";
import api from "../api/axios";
import { useUsers } from "../context/UsersContext";

/* 요약 카드 */
function MetricCard({ label, value }) {
  return (
    <div className="rounded-lg bg-white border border-gray-100 px-3 py-2">
      <div className="text-[11px] text-gray-500">{label}</div>
      <div className="text-[15px] font-semibold text-gray-900 mt-0.5">
        {value ?? "—"}
      </div>
    </div>
  );
}

/* 읽기용 행 (라벨 폭 고정) */
function ReadRow({ leftLabel, leftValue, rightLabel, rightValue }) {
  return (
    <div className="grid grid-cols-2 gap-6 py-2">
      <div className="flex">
        <div className="shrink-0 w-28 text-xs text-gray-500 pt-0.5">{leftLabel}</div>
        <div className="text-[15px] font-medium text-gray-900 break-words min-h-[20px]">
          {leftValue ?? "—"}
        </div>
      </div>
      <div className="flex">
        <div className="shrink-0 w-28 text-xs text-gray-500 pt-0.5">{rightLabel}</div>
        <div className="text-[15px] font-medium text-gray-900 break-words min-h-[20px]">
          {rightValue ?? "—"}
        </div>
      </div>
    </div>
  );
}

function LogDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usersMap, usersLoading } = useUsers();

  const [log, setLog] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({});
  const [loadError, setLoadError] = useState(null);

  const currentUser = authService.getUser();
  const BASE_URL = "https://scoopadive.com";
  const fileInputRef = useRef(null);

  // 폼 채우기 유틸
  const fillFormFrom = (data) =>
    setForm({
      dive_title: data?.dive_title || "",
      dive_site: data?.dive_site || "",
      dive_date: data?.dive_date || "",
      max_depth: data?.max_depth || "",
      bottom_time: data?.bottom_time || "",
      weather: data?.weather || "sunny",
      type_of_dive: data?.type_of_dive || "fun",
      weight: data?.weight || "",
      start_pressure: data?.start_pressure || "",
      end_pressure: data?.end_pressure || "",
      equipment:
        Array.isArray(data?.equipment) && data.equipment.length > 0
          ? data.equipment.map((e) => e?.name).filter(Boolean)
          : [],
      dive_center: data?.dive_center_name || "",
      memo: data?.memo || "",
      location: data?.location || "",
      feeling: data?.feeling || "",
      certification_agency: data?.certification_agency || "",
      certification_level: data?.certification_level || "",
      certification_number: data?.certification_number || "",
    });

  // 데이터 로드
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoadError(null);
        const result = await logService.getLogById(id);
        if (!alive) return;

        setLog({
          ...result,
          likes_count: result?.likes_count ?? 0,
          liked_by_current_user: result?.liked_by_current_user ?? false,
          is_published: result?.is_published ?? false, // 서버에서 내려주는 값 가정
        });

        fillFormFrom(result);

        if (result?.dive_image) {
          const isFullURL = result.dive_image.startsWith("http");
          setImagePreview(isFullURL ? result.dive_image : `${BASE_URL}${result.dive_image}`);
        } else {
          setImagePreview(null);
        }
        setSelectedImageFile(null);
      } catch {
        if (!alive) return;
        setLoadError("Failed to fetch the log. Please try again.");
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  const isOwner = String(currentUser?.id) === String(log?.user);

  // Back 동작: 편집 중이면 원상복구, 아니면 페이지 뒤로
  const handleBack = () => {
    if (isEditing) {
      fillFormFrom(log); // 편집 전 값 복원
      setSelectedImageFile(null);
      // 기존 프리뷰 유지(저장 전이므로 서버 반영 안 됨)
      setIsEditing(false);
    } else {
      navigate(-1);
    }
  };

  const handleLike = async () => {
    if (!log) return;
    try {
      let res;
      if (log.liked_by_current_user) {
        res = await api.delete(`/logbooks/${log.id}/like/`);
      } else {
        res = await api.post(`/logbooks/${log.id}/like/`);
      }
      setLog((prev) => ({
        ...prev,
        liked_by_current_user: !prev.liked_by_current_user,
        likes_count: res?.data?.likes_count ?? prev.likes_count,
      }));
    } catch (err) {
      console.error("Failed to toggle like", err);
    }
  };

  const handleChange = (field) => (e) => {
    const value = e?.target?.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // 이미지 선택
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  // 저장
  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      if (Array.isArray(form.equipment)) {
        form.equipment.forEach((eq) => formData.append("equipment", eq));
      }

      Object.entries(form).forEach(([key, value]) => {
        if (key === "equipment") return;
        if (value !== null && value !== "") {
          formData.append(key, value);
        }
      });

      // 이미지 업로드 포함
      if (selectedImageFile) {
        formData.append("dive_image", selectedImageFile);
      }

      await logService.updateLog(log.id, formData);

      setIsEditing(false);
      const updated = await logService.getLogById(id);
      setLog({
        ...updated,
        likes_count: updated?.likes_count ?? 0,
        liked_by_current_user: updated?.liked_by_current_user ?? false,
        is_published: updated?.is_published ?? false,
      });

      if (updated?.dive_image) {
        const isFullURL = updated.dive_image.startsWith("http");
        setImagePreview(isFullURL ? updated.dive_image : `${BASE_URL}${updated.dive_image}`);
      } else {
        setImagePreview(null);
      }
      setSelectedImageFile(null);
    } catch (err) {
      alert("Update failed: " + (err?.response?.data?.detail || err?.message));
    }
  };

  // 게시하기
  const handlePublish = async () => {
    // 사진 필수 검증: 새로 선택한 파일 또는 기존 이미지 프리뷰가 있어야 함
    const hasPhoto = !!selectedImageFile || !!imagePreview;
    if (!hasPhoto) {
      alert("사진이 필요합니다. 사진을 추가한 후 게시해주세요.");
      setIsEditing(true);
      // 사진 입력 포커스
      setTimeout(() => fileInputRef.current?.focus?.(), 0);
      return;
    }
    try {
      const res = await api.post(`/logbooks/${log.id}/publish/`);
      setLog((prev) => ({ ...prev, is_published: res?.data?.is_published ?? true }));
      alert("게시가 완료되었습니다.");
    } catch (err) {
      alert("게시 실패: " + (err?.response?.data?.detail || err?.message));
    }
  };

  if (usersLoading) {
    return (
      <Layout>
        <div className="text-center mt-8 text-gray-500 text-sm">Loading...</div>
      </Layout>
    );
  }

  if (loadError) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-6 py-10">
          <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-4">
            {loadError}
          </div>
          <div className="mt-4">
            <button
              onClick={handleBack}
              className="px-3 py-1.5 text-xs border rounded-md text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!log) {
    return (
      <Layout>
        <div className="text-center mt-8 text-gray-500 text-sm">No data.</div>
      </Layout>
    );
  }

  const summary = [
    { label: "Dive No", value: log?.id },
    { label: "Date", value: log?.dive_date || "—" },
    { label: "Max Depth", value: log?.max_depth ? `${log.max_depth} m` : "—" },
    { label: "Dive Time", value: log?.bottom_time || "—" },
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-6 py-8 font-sans text-gray-900">
        {/* 헤더 */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="min-w-0">
            <h1 className="text-[22px] font-bold truncate">{log?.dive_title || "Dive Log"}</h1>
            <p className="text-xs text-gray-500 truncate">
              {log?.dive_site || "Unknown site"} · {log?.dive_date || "Unknown date"}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleBack}
              className="px-3 py-1.5 text-xs border rounded-md text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>

            {/* Publish 버튼: 소유자 & 미게시 상태에서만 */}
            {isOwner && !log?.is_published && !isEditing && (
              <button
                onClick={handlePublish}
                className="px-3 py-1.5 text-xs rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Publish
              </button>
            )}

            {/* 게시 완료 배지 */}
            {log?.is_published && (
              <span className="px-2 py-1 text-[11px] rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                Published
              </span>
            )}

            <button
              onClick={handleLike}
              className={`px-3 py-1.5 text-xs rounded-md font-semibold ${
                log?.liked_by_current_user
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {log?.liked_by_current_user ? "Liked" : "Like"} {log?.likes_count ?? 0}
            </button>

            {isOwner && !isEditing && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-1.5 text-xs border border-blue-600 text-blue-700 rounded-md hover:bg-blue-50"
                >
                  Edit
                </button>
                <button
                  onClick={async () => {
                    if (window.confirm("Are you sure you want to delete this log?")) {
                      await logService.deleteLog(log.id);
                      navigate("/mypage");
                    }
                  }}
                  className="px-3 py-1.5 text-xs border border-red-600 text-red-700 rounded-md hover:bg-red-50"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>

        {/* 균형 맞춘 2열 */}
        <div className="grid grid-cols-2 gap-8 items-stretch">
          {/* 좌: Diver's ID */}
          <section className="bg-white rounded-2xl shadow p-6 h-full flex flex-col">
            <h2 className="text-[17px] font-bold text-gray-800 mb-3">Diver&apos;s ID</h2>

            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Dive"
                className="w-full h-[180px] object-cover rounded-xl mb-4"
              />
            ) : (
              <div className="w-full h-[180px] bg-gray-100 rounded-xl mb-4 flex items-center justify-center text-gray-400 text-sm">
                No Photo
              </div>
            )}

            <div className="space-y-2">
              <div className="flex">
                <div className="w-28 text-xs text-gray-500">Diver</div>
                <div className="text-[15px] font-medium">
                  {usersMap?.[log.user] ?? "Unknown"}
                </div>
              </div>
              <div className="flex">
                <div className="w-28 text-xs text-gray-500">Buddy</div>
                <div className="text-[15px] font-medium">
                  {usersMap?.[log.buddy] ?? log.buddy ?? "Unknown"}
                </div>
              </div>
              <div className="flex">
                <div className="w-28 text-xs text-gray-500">Certification Level</div>
                <div className="text-[15px] font-medium">
                  {log?.certification_level || "Not provided"}
                </div>
              </div>
              <div className="flex">
                <div className="w-28 text-xs text-gray-500">Agency</div>
                <div className="text-[15px] font-medium">
                  {log?.certification_agency || "—"}
                </div>
              </div>
              <div className="flex">
                <div className="w-28 text-xs text-gray-500">Cert No.</div>
                <div className="text-[15px] font-medium">
                  {log?.certification_number || "—"}
                </div>
              </div>
            </div>

            <div className="mt-auto" />
          </section>

          {/* 우: LOG ENTRY */}
          <section className="bg-white rounded-2xl shadow p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[17px] font-bold text-gray-800">LOG ENTRY</h2>
            </div>

            <div className="flex-1 flex flex-col">
              {isEditing ? (
                <div className="space-y-5 flex-1 flex flex-col">
                  <div className="grid grid-cols-4 gap-3 rounded-xl border border-gray-100 p-3 bg-gray-50">
                    <MetricCard label="Dive No" value={log?.id} />
                    <MetricCard label="Date" value={form?.dive_date || "—"} />
                    <MetricCard label="Max Depth" value={form?.max_depth ? `${form.max_depth} m` : "—"} />
                    <MetricCard label="Dive Time" value={form?.bottom_time || "—"} />
                  </div>

                  {/* 사진 업로드 필드 추가 */}
                  <div className="py-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Photo (required for publishing)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="block w-full text-sm text-gray-700 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                      />
                    </div>
                  </div>

                  <div className="divide-y divide-gray-100">
                    <div className="py-3 grid grid-cols-2 gap-6">
                      <Input label="Title" value={form.dive_title} onChange={handleChange("dive_title")} />
                      <Input label="Site" value={form.dive_site} onChange={handleChange("dive_site")} />
                    </div>

                    <div className="py-3 grid grid-cols-2 gap-6">
                      <Input label="Date" type="date" value={form.dive_date} onChange={handleChange("dive_date")} />
                      <Input label="Max Depth" type="number" value={form.max_depth} onChange={handleChange("max_depth")} />
                    </div>

                    <div className="py-3 grid grid-cols-2 gap-6">
                      <Input label="Bottom Time" value={form.bottom_time} onChange={handleChange("bottom_time")} />
                      <Input label="Location" value={form.location} onChange={handleChange("location")} />
                    </div>

                    <div className="py-3 grid grid-cols-2 gap-6">
                      <Input label="Weather" value={form.weather} onChange={handleChange("weather")} />
                      <Input label="Dive Type" value={form.type_of_dive} onChange={handleChange("type_of_dive")} />
                    </div>

                    <div className="py-3 grid grid-cols-2 gap-6">
                      <Input label="Weight" type="number" value={form.weight} onChange={handleChange("weight")} />
                      <div className="grid grid-cols-2 gap-4">
                        <Input label="Start P" type="number" value={form.start_pressure} onChange={handleChange("start_pressure")} />
                        <Input label="End P" type="number" value={form.end_pressure} onChange={handleChange("end_pressure")} />
                      </div>
                    </div>

                    <div className="py-3 grid grid-cols-2 gap-6">
                      <Input label="Dive Center" value={form.dive_center} onChange={handleChange("dive_center")} />
                      <Input
                        label="Equipment (comma separated)"
                        value={Array.isArray(form.equipment) ? form.equipment.join(", ") : ""}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            equipment: e.target.value
                              .split(",")
                              .map((s) => s.trim())
                              .filter(Boolean),
                          }))
                        }
                      />
                    </div>

                    <div className="py-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                      <textarea
                        className="w-full border rounded-md px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-200"
                        rows={4}
                        value={form.memo}
                        onChange={handleChange("memo")}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <button
                      onClick={handleSubmit}
                      className="bg-blue-600 text-white text-sm py-2 px-4 rounded-md hover:bg-blue-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleBack}
                      className="bg-gray-400 text-white text-sm py-2 px-4 rounded-md hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-4 gap-3 rounded-xl border border-gray-100 p-3 bg-gray-50 mb-4">
                    {summary.map((m) => (
                      <MetricCard key={m.label} label={m.label} value={m.value} />
                    ))}
                  </div>

                  <div className="divide-y divide-gray-100">
                    <ReadRow
                      leftLabel="Title"
                      leftValue={log?.dive_title || "Untitled"}
                      rightLabel="Dive Site"
                      rightValue={log?.dive_site || "Unknown"}
                    />
                    <ReadRow
                      leftLabel="Location"
                      leftValue={log?.location || "—"}
                      rightLabel="Weather"
                      rightValue={log?.weather || "—"}
                    />
                    <ReadRow
                      leftLabel="Dive Type"
                      leftValue={log?.type_of_dive || "—"}
                      rightLabel="Weight"
                      rightValue={log?.weight ? `${log.weight} kg` : "—"}
                    />
                    <ReadRow
                      leftLabel="Start P"
                      leftValue={log?.start_pressure ?? "—"}
                      rightLabel="End P"
                      rightValue={log?.end_pressure ?? "—"}
                    />
                    <ReadRow
                      leftLabel="Dive Center"
                      leftValue={log?.dive_center_name || "—"}
                      rightLabel="Equipment"
                      rightValue={
                        Array.isArray(log?.equipment) && log.equipment.length > 0
                          ? log.equipment.map((e) => e?.name).filter(Boolean).join(", ")
                          : "—"
                      }
                    />
                  </div>

                  <div className="mt-4">
                    <h3 className="text-sm font-semibold mb-1">Notes</h3>
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-900 rounded-md text-[14px] leading-snug px-3 py-2 min-h-[48px]">
                      {log?.memo ? (
                        <span>{log.memo}</span>
                      ) : (
                        <span className="italic text-yellow-800/80">No notes recorded.</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-auto" />
                </>
              )}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}

export default LogDetailPage;
