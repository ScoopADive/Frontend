// components/cards/SkillCard.jsx
import PropTypes from "prop-types";
import { memo, useMemo } from "react";
import { Trophy, Award, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import { getLevelColor } from "../../constants/divingCerts";

const REQUIRED_DIVES = 50;

function SkillCard({ skill }) {
  const {
    level = "Open Water Diver",
    specialties = [],
    logs = 0,
  } = skill || {};

  const specialtyCount = Array.isArray(specialties) ? specialties.length : 0;

  const hasRescue =
    (level || "").toLowerCase().includes("rescue") ||
    specialties.some((s) => (s || "").toLowerCase().includes("rescue"));

  // Master Scuba Diver 요건 카운트
  const msdCount =
    (hasRescue ? 1 : 0) + (specialtyCount >= 5 ? 1 : 0) + (logs >= REQUIRED_DIVES ? 1 : 0);

  // 원형 게이지
  const R = 60;
  const C = 2 * Math.PI * R;
  const ringPct = msdCount / 3;
  const dash = Math.max(0.0001, C * ringPct);
  const gap = C - dash;

  const nextSteps = useMemo(() => {
    const steps = [];
    if (!hasRescue) steps.push("Get Rescue Diver certification");
    if (specialtyCount < 5) steps.push(`${5 - specialtyCount} more specialties`);
    if (logs < REQUIRED_DIVES) steps.push(`${REQUIRED_DIVES - logs} more dives`);
    return steps;
  }, [hasRescue, specialtyCount, logs]);

  const allDone = nextSteps.length === 0;

  return (
    <div className="rounded-2xl bg-white pt-[2px] pb-5 px-5 sm:pt-[3px] sm:pb-6 sm:px-6">
      {/* ===== 헤더 ===== */}
      <div className="flex items-center gap-8">
        {/* 원형 게이지 */}
        <div className="relative flex items-center justify-center">
          <svg
            width="130"
            height="130"
            viewBox="0 0 130 130"
            className="block"
            aria-hidden="true"
          >
            <circle
              cx="65"
              cy="65"
              r={R}
              fill="none"
              stroke="rgba(148,163,184,0.05)"
              strokeWidth="8"
            />
            <circle
              cx="65"
              cy="65"
              r={R}
              fill="none"
              stroke="#D4A21A"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${gap}`}
              transform="rotate(-90 65 65)"
            />
          </svg>

          {/* 중앙 트로피 & 분수 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Trophy size={46} className="text-amber-500" />
            <div className="mt-1 text-slate-900 text-xl font-semibold tabular-nums">
              {msdCount}/3
            </div>
          </div>
        </div>

        {/* 우측 정보 블록 */}
        <div className="min-w-0 flex-1">
          <div className="mb-2">
            <div className="text-slate-500 text-sm">Current Level</div>
            <div className="mt-2 inline-flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-2 rounded-full ${getLevelColor(
                  level
                )} text-white text-sm font-semibold px-4 py-1.5`}
              >
                <Award size={16} />
                <span className="truncate">{level}</span>
              </span>
            </div>
          </div>

          {/* 총 다이브 수 */}
          <div className="flex items-end gap-2">
            <div className="text-3xl leading-none font-semibold text-slate-900 tabular-nums">
              {logs}
            </div>
            <div className="pb-0.5 text-slate-600">dives</div>
          </div>

          <div className="mt-2 text-slate-600 text-sm">
            Master Diver: <span className="tabular-nums">{msdCount}/3</span> completed
          </div>
        </div>
      </div>

      {/* 구분선 */}
      <div className="my-5 h-px bg-slate-200/60" />

      {/* 스페셜티 태그 */}
      {Array.isArray(specialties) && specialties.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1.5">
            {specialties.map((s, idx) => (
              <span
                key={`${s}-${idx}`}
                className="bg-blue-50 text-blue-700 border border-blue-100/80 px-2 py-0.5 rounded-full text-xs"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 체크 카드 3개 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
        <div
          className={`rounded-xl p-3 ${
            hasRescue ? "bg-green-50" : "bg-white"
          } ring-1 ring-slate-200`}
        >
          <p className="font-medium text-slate-900">Rescue Diver</p>
          <p className="text-slate-600 text-xs">{hasRescue ? "Completed" : "Not yet"}</p>
        </div>

        <div
          className={`rounded-xl p-3 ${
            specialtyCount >= 5 ? "bg-green-50" : "bg-white"
          } ring-1 ring-slate-200`}
        >
          <p className="font-medium text-slate-900">Specialties</p>
          <p className="text-slate-600 text-xs">{specialtyCount} / 5</p>
        </div>

        <div
          className={`rounded-xl p-3 ${
            logs >= REQUIRED_DIVES ? "bg-green-50" : "bg-white"
          } ring-1 ring-slate-200`}
        >
          <p className="font-medium text-slate-900">Logged dives</p>
          <p className="text-slate-600 text-xs">
            {logs} / {REQUIRED_DIVES}
          </p>
        </div>
      </div>

      {/* ===== 하단 교육 CTA ===== */}
      <div className="mt-6 rounded-xl ring-1 ring-indigo-200/60 bg-indigo-50/60 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-3 min-w-0">
            <div className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-100">
              <GraduationCap size={18} className="text-indigo-700" />
            </div>
            <div className="min-w-0">
              <div className="text-slate-900 font-semibold">
                Level up your diving with tailored training
              </div>
              <p className="text-slate-600 text-sm mt-1">
                {allDone
                  ? "You've met all Master Scuba Diver requirements—awesome! Explore advanced specialties to broaden your range and keep your skills sharp."
                  : "Based on your current profile, we’ll recommend the most relevant courses to close the gap fast—whether that’s Rescue, key specialties, or targeted dive practice."}
              </p>
            </div>
          </div>

          {/* 연한 기본 → 호버 시 진해지는 버튼 (아이콘 제거) */}
          <div className="sm:ml-auto">
            <Link
              to="/training"
              aria-label="Go to Training"
              className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold
                         bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200/70
                         hover:bg-indigo-600 hover:text-white hover:ring-indigo-600/80
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
                         transition-colors"
            >
              Go to Training
            </Link>
          </div>
        </div>
      </div>
      {/* ===== /하단 교육 CTA ===== */}
    </div>
  );
}

SkillCard.propTypes = {
  skill: PropTypes.shape({
    level: PropTypes.string,
    specialties: PropTypes.arrayOf(PropTypes.string),
    logs: PropTypes.number,
  }),
};

export default memo(SkillCard);
