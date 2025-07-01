import PropTypes from "prop-types";

function TimelineBox({ milestones }) {
  // 더미 자격증 이력
  const dummyMilestones = [
    { date: "2023-06-01", title: "Open Water Certification" },
    { date: "2024-01-15", title: "Advanced OW Certification" },
    { date: "2025-03-10", title: "Night Dive Specialty" },
  ];

  const timeline = milestones && milestones.length > 0 ? milestones : dummyMilestones;

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold mb-2">🌟 Certification Timeline</h3>
      <div className="space-y-2 border-l-2 border-blue-300 pl-4">
        {timeline.map((m, idx) => (
          <div key={`${m.date}-${idx}`}>
            <p className="text-sm text-gray-600">{m.date}</p>
            <p className="font-medium">{m.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

TimelineBox.propTypes = {
  milestones: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ),
};

export default TimelineBox;
