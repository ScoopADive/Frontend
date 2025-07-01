import PropTypes from "prop-types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function ChartBox({ data }) {
  // 더미 데이터
  const dummyData = [
    { date: "2025-06-01", depth: 18 },
    { date: "2025-06-10", depth: 22 },
    { date: "2025-06-18", depth: 15 },
    { date: "2025-06-25", depth: 28 },
  ];

  const chartData = data && data.length > 0 ? data : dummyData;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-2">📉 Dive Depth Trend</h2>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 40]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="depth"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

ChartBox.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      depth: PropTypes.number.isRequired,
    })
  ),
};

export default ChartBox;
