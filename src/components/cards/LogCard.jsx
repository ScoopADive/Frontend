import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { format } from "date-fns"; // 날짜 포맷을 위한 라이브러리

function LogCard({ log }) {
  const {
    id,
    dive_title,
    dive_site,
    dive_date,
    max_depth,
    bottom_time,
  } = log;

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/log/${id}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleClick();
    }
  };

  let formattedDate = dive_date;
  try {
    formattedDate = format(new Date(dive_date), "PPP");
  } catch (error) {
    console.warn("Invalid date format in LogCard:", dive_date);
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="bg-white shadow-md rounded-xl p-4 w-full max-w-md mx-auto mb-5 hover:shadow-lg transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <h2 className="text-lg font-semibold text-blue-600 mb-2">{dive_title}</h2>
      <ul className="text-sm text-gray-700 space-y-1">
        <li>📍 <strong>Site:</strong> {dive_site}</li>
        <li>📅 <strong>Date:</strong> {formattedDate}</li>
        <li>📏 <strong>Max Depth:</strong> {max_depth}</li>
        <li>⏱ <strong>Bottom Time:</strong> {bottom_time}</li>
      </ul>
    </div>
  );
}

LogCard.propTypes = {
  log: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    dive_title: PropTypes.string.isRequired,
    dive_site: PropTypes.string.isRequired,
    dive_date: PropTypes.string.isRequired,
    max_depth: PropTypes.string.isRequired,
    bottom_time: PropTypes.string.isRequired,
  }).isRequired,
};

export default LogCard;
