// src/api/ai.js
import api from './axios';

/**
 * PUT /ai/
 * - 백엔드에 "지금 preferences 기준으로 AI 추천 다시 만들어줘" 라고 요청
 */
export async function triggerAiUpdate() {
  const res = await api.put('/ai/');
  return res.data;
}

/**
 * GET /ai/
 * - AI가 만든 추천 다이브 스팟 목록 가져오기
 * - 응답 형식이 배열 또는 {results: []} 둘 다 올 수 있다고 가정하고 처리
 */
export async function fetchAiRecommendations() {
  const res = await api.get('/ai/');
  const data = res.data;

  if (!data) return [];

  if (Array.isArray(data)) return data;
  if (Array.isArray(data.results)) return data.results;

  return [];
}
