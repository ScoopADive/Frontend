import PropTypes from "prop-types";

function ExperienceBox({ stats }) {
  const dummyStats = {
    totalDives: 45,
    totalHours: 32.5,
    level: "Advanced",
    percentToNext: 70,
  };

  const display = stats || dummyStats;

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">🔥 Dive Experience</h3>
      <div className="mb-3 space-y-1 text-gray-700">
        <p>Total Dives: <span className="font-semibold">{display.totalDives}</span></p>
        <p>Total Dive Time: <span className="font-semibold">{display.totalHours} hours</span></p>
        <p>Current Level: <span className="font-semibold">{display.level}</span></p>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
        <div
          className="bg-blue-400 h-4 rounded-full text-xs text-white text-center"
          style={{ width: `${display.percentToNext}%` }}
        >
          {display.percentToNext}%
        </div>
      </div>
    </div>
  );
}

ExperienceBox.propTypes = {
  stats: PropTypes.shape({
    totalDives: PropTypes.number,
    totalHours: PropTypes.number,
    level: PropTypes.string,
    percentToNext: PropTypes.number,
  }),
};

export default ExperienceBox;
