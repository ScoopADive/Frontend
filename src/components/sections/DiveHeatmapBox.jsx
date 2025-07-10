import React from "react";
import PropTypes from "prop-types";

const dummyHeatmapData = [
  { month: "Jan", count: 3 },
  { month: "Feb", count: 1 },
  { month: "Mar", count: 5 },
  { month: "Apr", count: 2 },
  { month: "May", count: 4 },
  { month: "Jun", count: 6 },
  { month: "Jul", count: 3 },
  { month: "Aug", count: 7 },
  { month: "Sep", count: 2 },
  { month: "Oct", count: 5 },
  { month: "Nov", count: 1 },
  { month: "Dec", count: 0 },
];

const getColor = (count) => {
  if (count >= 6) return "bg-blue-400 text-white";
  if (count >= 4) return "bg-blue-300 text-white";
  if (count >= 2) return "bg-blue-200 text-gray-800";
  if (count >= 1) return "bg-blue-100 text-gray-800";
  return "bg-gray-100 text-gray-500";
};

function DiveHeatmapBox({ data }) {
  const displayData = data && data.length > 0 ? data : dummyHeatmapData;

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">📅 Dive Frequency Heatmap</h3>
      <div className="grid grid-cols-6 gap-2">
        {displayData.map((item, idx) => (
          <div
            key={`${item.month}-${idx}`}
            className={`flex flex-col items-center justify-center p-2 rounded font-medium text-xs ${getColor(item.count)}`}
          >
            <span>{item.month}</span>
            <span>{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

DiveHeatmapBox.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    })
  ),
};

export default DiveHeatmapBox;
