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
import dayjs from "dayjs";

function ChartBox({ logs }) {
  const transformed = (logs || [])
    .filter((log) => log.dive_date && log.max_depth)
    .map((log) => ({
      date: dayjs(log.dive_date).format("YYYY-MM-DD"),
      depth: Number(log.max_depth),
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date)); // 시간순 정렬

  const chartData = transformed.length > 0
    ? transformed
    : [
        { date: "2025-06-01", depth: 18 },
        { date: "2025-06-10", depth: 22 },
        { date: "2025-06-18", depth: 15 },
        { date: "2025-06-25", depth: 28 },
      ];

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
  logs: PropTypes.arrayOf(
    PropTypes.shape({
      dive_date: PropTypes.string,
      max_depth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
};

export default ChartBox;
