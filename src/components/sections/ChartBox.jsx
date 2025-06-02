import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const sampleData = [
  { date: "05-01", depth: 18 },
  { date: "05-05", depth: 22 },
  { date: "05-10", depth: 20 },
  { date: "05-15", depth: 25 },
  { date: "05-18", depth: 28 },
];

function ChartBox() {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-2">📉 Dive Depth Trend</h2>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={sampleData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 40]} />
          <Tooltip />
          <Line type="monotone" dataKey="depth" stroke="#3b82f6" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ChartBox;
