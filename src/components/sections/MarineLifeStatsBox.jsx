import PropTypes from "prop-types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const dummyData = [
  { species: "Turtle", count: 5 },
  { species: "Clownfish", count: 8 },
  { species: "Shark", count: 2 },
  { species: "Manta Ray", count: 3 },
  { species: "Octopus", count: 4 },
];

function MarineLifeStatsBox({ data }) {
  const chartData = data && data.length > 0 ? data : dummyData;

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">🐠 Marine Life Observed</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="species" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#60a5fa" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

MarineLifeStatsBox.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      species: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    })
  ),
};

export default MarineLifeStatsBox;
