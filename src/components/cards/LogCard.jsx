import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { format } from "date-fns"; // 날짜 포맷을 위한 라이브러리

function LogCard({ log }) {
  const { id, title, site, date, depth, bottomTime } = log;
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/log/${id}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleClick();
    }
  };

  // 날짜 포맷 처리 (예외 방지)
  let formattedDate = date;
  try {
    formattedDate = format(new Date(date), "PPP");
  } catch (error) {
    console.warn("Invalid date format in LogCard:", date);
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="bg-white shadow-md rounded-xl p-4 w-full max-w-md mx-auto mb-5 hover:shadow-lg transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <h2 className="text-lg font-semibold text-blue-600 mb-2">{title}</h2>
      <ul className="text-sm text-gray-700 space-y-1">
        <li>📍 <strong>Site:</strong> {site}</li>
        <li>📅 <strong>Date:</strong> {formattedDate}</li>
        <li>📏 <strong>Max Depth:</strong> {depth}</li>
        <li>⏱ <strong>Bottom Time:</strong> {bottomTime}</li>
      </ul>
    </div>
  );
}

LogCard.propTypes = {
  log: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    site: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    depth: PropTypes.string.isRequired,
    bottomTime: PropTypes.string.isRequired,
  }).isRequired,
};

export default LogCard;

