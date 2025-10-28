import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { format } from "date-fns";
import { Anchor, Clock } from "lucide-react";

function LogCard({ log }) {
  const navigate = useNavigate();
  const { id, dive_title, dive_date, max_depth, bottom_time } = log;

  const handleClick = () => navigate(`/log/${id}`);
  const handleKeyDown = (e) => e.key === "Enter" && handleClick();

  // 날짜 파싱(안전)
  let dateObj = null;
  try { dateObj = dive_date ? new Date(dive_date) : null; } catch {}
  const month = dateObj ? format(dateObj, "MMM").toUpperCase() : "--";
  const day   = dateObj ? format(dateObj, "dd") : "--";
  const year  = dateObj ? format(dateObj, "yyyy") : "--";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="group flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 cursor-pointer transition-all
                 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-sky-400"
    >
      {/* 날짜 박스: 정사각형 20x20, 타이포 정렬 보정 */}
      <div className="flex-shrink-0 w-20 h-20 rounded-md bg-slate-100 text-slate-700
                      flex flex-col items-center justify-center select-none">
        <span className="text-[10px] tracking-[0.08em]">{month}</span>
        <span className="text-2xl font-extrabold leading-none">{day}</span>
        <span className="text-[10px] mt-0.5 opacity-75">{year}</span>
      </div>

      {/* 본문 */}
      <div className="flex-1 ml-4 min-w-0">
        <h2 className="text-base font-semibold text-slate-800 mb-2 truncate">
          {dive_title || "Untitled Dive"}
        </h2>

        {/* 깔끔한 pill 스타일: ring + 작은 폰트 + 균일 패딩 */}
        <div className="flex flex-wrap items-center gap-2 text-slate-700">
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 ring-1 ring-slate-200 px-3 py-1 text-[12px]">
            <Anchor className="w-[14px] h-[14px]" />
            {max_depth ? `${max_depth}m` : "—"}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 ring-1 ring-slate-200 px-3 py-1 text-[12px]">
            <Clock className="w-[14px] h-[14px]" />
            {bottom_time ? `${bottom_time}min` : "—"}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 ring-1 ring-slate-200 px-3 py-1 text-[12px]">
            {`Dive #${id}`}
          </span>
        </div>
      </div>

      {/* View Details: 호버시에만 부드럽게 표시 */}
      <div className="ml-4">
        <span
          onClick={(e) => { e.stopPropagation(); handleClick(); }}
          className="text-sm text-slate-600 opacity-0 translate-x-1 transition-all duration-200
                     group-hover:opacity-100 group-hover:translate-x-0 hover:text-slate-900"
        >
          View Details →
        </span>
      </div>
    </div>
  );
}

LogCard.propTypes = {
  log: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    dive_title: PropTypes.string,
    dive_site: PropTypes.string,
    dive_date: PropTypes.string,
    max_depth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    bottom_time: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
};

export default LogCard;
