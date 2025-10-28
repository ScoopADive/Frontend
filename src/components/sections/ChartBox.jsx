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
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const chartData =
    transformed.length > 0
      ? transformed
      : [
          { date: "2025-06-01", depth: 18 },
          { date: "2025-06-10", depth: 22 },
          { date: "2025-06-18", depth: 15 },
          { date: "2025-06-25", depth: 28 },
        ];

  return (
    <div className="rounded-2xl bg-white shadow-[0_4px_16px_rgba(15,23,42,0.06)] p-4 sm:p-5">
      <ResponsiveContainer width="100%" height={240}>
        <LineChart
          data={chartData}
          margin={{
            top: 20,
            right: 20,
            left: 0,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            interval="preserveEnd"
            padding={{ left: 10, right: 10 }}
          />
          <YAxis
            domain={[0, 40]}
            tick={{ fontSize: 12 }}
            tickFormatter={(v) => `${v} m`}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="depth"
            stroke="#3b82f6"
            strokeWidth={2.2}
            dot={{ r: 2.8 }}
            activeDot={{ r: 4.2 }}
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
