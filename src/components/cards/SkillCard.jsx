import PropTypes from "prop-types";
import { useState } from "react";

function SkillCard({ skill: initialSkill }) {
  const [skill, setSkill] = useState(initialSkill);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    level: "",
    specialties: "",
    logs: 0,
  });

  const handleAddClick = () => {
    setShowForm(!showForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const logsNum = parseInt(formData.logs, 10) || 0;
    const newSkill = {
      title: "Open Water Diver",
      level: formData.level || "Open Water Diver",
      logs: logsNum,
      remainingToMaster: Math.max(50 - logsNum, 0),
    };

    setSkill(newSkill);
    setShowForm(false);
  };

  if (!skill) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-6">
      {/* 상단 타이틀 + 버튼을 한 줄로 */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-gray-800">🏅 My Skills</h2>
        <button
          onClick={handleAddClick}
          className="bg-gray-200 hover:bg-gray-300 text-sm text-gray-800 py-1 px-3 rounded"
        >
          {showForm ? "Cancel" : "Add"}
        </button>
      </div>

      <p className="text-gray-700 font-medium mb-1">
        {skill.level} ({skill.logs} dives)
      </p>

      <p className="text-sm text-red-500 mb-4">
        {skill.remainingToMaster} more dives to become Master Diver
      </p>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4 space-y-2">
          <input
            type="text"
            name="level"
            placeholder="Level (e.g., Open Water Diver)"
            value={formData.level}
            onChange={handleChange}
            className="w-full border px-3 py-1 rounded text-sm"
            required
          />
          <input
            type="text"
            name="specialties"
            placeholder="Specialties (comma separated)"
            value={formData.specialties}
            onChange={handleChange}
            className="w-full border px-3 py-1 rounded text-sm"
          />
          <input
            type="number"
            name="logs"
            placeholder="Total Dives"
            value={formData.logs}
            onChange={handleChange}
            className="w-full border px-3 py-1 rounded text-sm"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600"
          >
            Save
          </button>
        </form>
      )}

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
  }),
};

export default SkillCard;
