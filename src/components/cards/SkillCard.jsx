import PropTypes from "prop-types";

function SkillCard({ skill }) {
  if (!skill) return null;

  const handleAddClick = () => {
    alert("아직 구현되지 않은 기능입니다 🛠️");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">🏅 {skill.title}</h2>

      <p className="text-gray-700 font-medium mb-1">
        {skill.level} ({skill.logs} dives)
      </p>

      <p className="text-sm text-red-500 mb-4">
        {skill.remainingToMaster} more dives to become Master Diver
      </p>

      <button
        onClick={handleAddClick}
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-3 rounded mb-4"
      >
        Add Achievement
      </button>

      <ul className="text-sm text-gray-700 space-y-1">
        <li>• PADI {skill.level} 자격 보유</li>
        <li>• 여러 Specialty 코스 수료</li>
        <li>• 총 {skill.logs}회 이상 다이빙 로그 기록</li>
      </ul>
    </div>
  );
}

SkillCard.propTypes = {
  skill: PropTypes.shape({
    title: PropTypes.string,
    level: PropTypes.string,
    logs: PropTypes.number,
    remainingToMaster: PropTypes.number,
  }).isRequired,
};

export default SkillCard;

