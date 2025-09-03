import PropTypes from "prop-types";
import { memo, useMemo } from "react";
import { getLevelColor } from "../../constants/divingCerts";

const REQUIRED_DIVES = 50;

function SkillCard({ skill }) {
  const {
    title = "My Skills",
    level = "Open Water Diver",
    specialties = [],
    logs = 0,
  } = skill || {};

  const specialtyCount = Array.isArray(specialties) ? specialties.length : 0;

  const hasRescue =
    (level || "").toLowerCase().includes("rescue") ||
    specialties.some((s) => (s || "").toLowerCase().includes("rescue"));

  const progressPct = Math.min((logs / REQUIRED_DIVES) * 100, 100);

  const nextSteps = useMemo(() => {
    const steps = [];
    if (!hasRescue) steps.push("Get Rescue Diver certification");
    if (specialtyCount < 5) steps.push(`${5 - specialtyCount} more specialties`);
    if (logs < REQUIRED_DIVES) steps.push(`${REQUIRED_DIVES - logs} more dives`);
    return steps;
  }, [hasRescue, specialtyCount, logs]);

  const allDone = nextSteps.length === 0;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-6">
      {/* 상단 타이틀 */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <button
          className="text-xs px-2 py-1 rounded-full border text-gray-700 bg-gray-50 hover:bg-blue-100 hover:text-blue-700 transition"
          onClick={() => window.location.href = "/training"}
        >
          Go to Training Page
        </button>
      </div>

      {/* 현재 레벨 옆에만 컬러 배지 표시 */}
      <p className="text-gray-700 font-medium mb-1 flex items-center gap-2">
        <span className={`inline-block w-3 h-3 rounded-full ${getLevelColor(level)}`} />
        {level} ({logs} dives)
      </p>

      {/* 진행 바 */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="h-2 rounded-full bg-blue-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>
      <p className="text-xs text-gray-600 mt-1">
        {Math.max(REQUIRED_DIVES - logs, 0)} more dives to reach 50
      </p>

      {/* 스페셜티 태그 */}
      {Array.isArray(specialties) && specialties.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-800">Specialties</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {specialties.map((s, idx) => (
              <span
                key={`${s}-${idx}`}
                className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 체크리스트 카드. 원형 아이콘 제거하고 상태만 텍스트로 표시 */}
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-800">Master Scuba Diver checklist</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 text-sm">
          <div
            className={`rounded-lg border p-3 ${
              hasRescue ? "border-green-400 bg-green-50" : "border-gray-200 bg-white"
            }`}
          >
            <p className="font-medium">Rescue Diver</p>
            <p className="text-gray-600 text-xs">{hasRescue ? "Completed" : "Not yet"}</p>
          </div>

          <div
            className={`rounded-lg border p-3 ${
              specialtyCount >= 5 ? "border-green-400 bg-green-50" : "border-gray-200 bg-white"
            }`}
          >
            <p className="font-medium">Specialties</p>
            <p className="text-gray-600 text-xs">{specialtyCount} / 5</p>
          </div>

          <div
            className={`rounded-lg border p-3 ${
              logs >= REQUIRED_DIVES ? "border-green-400 bg-green-50" : "border-gray-200 bg-white"
            }`}
          >
            <p className="font-medium">Logged dives</p>
            <p className="text-gray-600 text-xs">
              {logs} / {REQUIRED_DIVES}
            </p>
          </div>
        </div>

        {/* 다음 단계 안내 */}
        <div className="mt-3">
          {allDone ? (
            <p className="text-sm text-green-700">All Master Scuba Diver requirements met.</p>
          ) : (
            <>
              <p className="text-sm text-gray-800 font-medium">Next steps</p>
              <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
                {nextSteps.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

SkillCard.propTypes = {
  skill: PropTypes.shape({
    title: PropTypes.string,
    level: PropTypes.string,
    specialties: PropTypes.arrayOf(PropTypes.string),
    logs: PropTypes.number,
  }),
};

export default memo(SkillCard);