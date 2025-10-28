import PropTypes from "prop-types";

function TimelineBox({ items }) {
  const fallback = [
    { date: "2023-06-01", title: "Open Water Certification" },
    { date: "2024-01-15", title: "Advanced Open Water Diver" },
    { date: "2024-08-20", title: "Deep Diving Specialty" },
    { date: "2025-02-10", title: "Underwater Photography Specialty" },
  ];

  const data =
    Array.isArray(items) && items.length > 0 ? items.slice(0, 4) : fallback;

  return (
    <div className="rounded-2xl bg-white shadow-[0_4px_16px_rgba(15,23,42,0.06)] p-4 sm:p-5">
      <div className="relative">
        {/* 세로 라인 */}
        <div className="absolute left-3 top-2 bottom-2 w-px bg-slate-200" />
        {/* 간격 줄임: space-y-6 → space-y-4 */}
        <ul className="space-y-4">
          {data.map((m, idx) => (
            <li key={`${m.title}-${idx}`} className="relative pl-8">
              {/* 불릿 */}
              <span className="absolute left-2 top-1.5 w-2.5 h-2.5 rounded-full bg-slate-900" />
              <div className="text-slate-900 font-medium">{m.title}</div>
              <div className="text-xs text-slate-500 mt-1">{m.date}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

TimelineBox.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ),
};

export default TimelineBox;


