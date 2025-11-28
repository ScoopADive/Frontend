// src/api/ai.js
import api from './axios';

/**
 * POST /recommend/spots/
 * - 백엔드에 "지금 preferences 기준으로 AI 추천 다시 만들어줘" 라고 요청
 * - 별도 바디가 필요 없으면 {} 로 보냄 (필요하면 Swagger 명세 보고 필드 추가)
 */
export async function triggerAiUpdate() {
  const res = await api.post('/recommend/spots/', {});
  return res.data;
}

/**
 * GET /recommend/spots/
 * - AI가 만든 추천 다이브 스팟 목록 가져오기
 * - 응답 형식이 배열 또는 {results: []} 둘 다 올 수 있다고 가정하고 처리
 */
export async function fetchAiRecommendations() {
  const res = await api.get('/recommend/spots/');
  const data = res.data;

  if (!data) return [];

  if (Array.isArray(data)) return data;
  if (Array.isArray(data.results)) return data.results;

  return [];
}

/**
 * (옵션) GET /recommend/spots/{spot_id}/
 * - 특정 추천 스팟 상세가 필요할 때 사용할 수 있는 헬퍼
 * - 지금은 안 쓰더라도 나중에 Spot 상세 페이지 만들 때 재사용 가능
 */
export async function fetchAiSpotDetail(spotId) {
  const res = await api.get(`/recommend/spots/${spotId}/`);
  return res.data;
}
