// src/api/photo.js
import api from "./axios";

/**
 * presigned 응답에서 uploadUrl / fileUrl을 꺼내는 유틸
 * (snake_case, camelCase 둘 다 대응)
 */
function normalizePresigned(data) {
  if (!data || typeof data !== "object") return { uploadUrl: null, fileUrl: null };

  const uploadUrl = data.uploadUrl || data.upload_url || data.url || null;
  const fileUrl =
    data.fileUrl || data.file_url || data.image_url || data.location || null;

  return { uploadUrl, fileUrl };
}

/**
 * 1) presigned URL 요청
 *
 * GET /photo/generate_presigned_url/
 *   ?filename=...
 *   &filetype=...
 *   (&scope=profile|log)
 *   (&log_id=123)
 */
export async function requestPresignedUrl({ filename, filetype, scope, logId } = {}) {
  if (!filename) throw new Error("filename is required");

  const params = {
    filename,
    filetype: filetype || "application/octet-stream",
  };
  if (scope) params.scope = scope;
  if (logId) params.log_id = logId;

  // 🔐 axios 인스턴스(api)를 사용 → JWT 자동 포함
  const res = await api.get("/photo/generate_presigned_url/", { params });

  console.log("[presigned] raw response:", res.data);          
  const { uploadUrl, fileUrl } = normalizePresigned(res.data);
  console.log("[presigned] normalized:", { uploadUrl, fileUrl }); // 👈 추가

  if (!uploadUrl || !fileUrl) {
    console.warn("Unexpected presigned response data:", res.data);
    throw new Error("Presigned URL 응답에 uploadUrl / fileUrl 이 없습니다.");
  }

  return { uploadUrl, fileUrl };
}

/**
 * 2) S3에 업로드 + Photo 레코드 생성
 *
 * - file: File 객체 (input[type=file]에서 온 것)
 * - options.scope: "profile" | "log" 등(선택)
 * - options.logId: 로그 아이디(선택)
 */
export async function uploadImageAndCreatePhoto(file, options = {}) {
  if (!file) throw new Error("File is required");

  // 1단계: presigned URL 요청
  const { uploadUrl, fileUrl } = await requestPresignedUrl({
    filename: file.name,
    filetype: file.type || "application/octet-stream",
    scope: options.scope,
    logId: options.logId,
  });

  // 2단계: S3에 직접 PUT 업로드
  const putRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type || "application/octet-stream",
    },
    body: file,
  });

  if (!putRes.ok) {
    throw new Error(`S3 업로드 실패: ${putRes.status} ${putRes.statusText}`);
  }

  // 3단계: Photo 레코드 생성 (실패해도 큰 문제 없게 try/catch)
  let photoId = null;
  try {
    const createRes = await api.post("/photo/", {
      title: file.name,
      image_url: fileUrl,
    });
    photoId = createRes.data?.id ?? null;
  } catch (err) {
    console.warn("Photo 레코드 생성 실패(무시 가능):", err);
  }

  // 프론트에서는 이미지 URL만 잘 쓰면 됨
  return { photoId, imageUrl: fileUrl };
}
