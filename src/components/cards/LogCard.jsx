import { useNavigate } from "react-router-dom";

function LogCard({ log }) {
  const { id, title, site, date, depth, bottomTime } = log;
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/log/${id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white shadow-md rounded-xl p-4 w-full max-w-md mx-auto mb-5 hover:shadow-lg transition cursor-pointer"
    >
      <h2 className="text-lg font-semibold text-blue-600 mb-2">{title}</h2>
      <ul className="text-sm text-gray-700 space-y-1">
        <li>📍 <strong>Site:</strong> {site}</li>
        <li>📅 <strong>Date:</strong> {date}</li>
        <li>📏 <strong>Max Depth:</strong> {depth}</li>
        <li>⏱ <strong>Bottom Time:</strong> {bottomTime}</li>
      </ul>
    </div>
  );
}

export default LogCard;


