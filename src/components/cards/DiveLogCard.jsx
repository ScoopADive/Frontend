import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Droplet, Clock, Cloud } from 'lucide-react';

function DiveLogCard({ log, usersMap }) {
  const navigate = useNavigate();

  const handleClick = () => navigate(`/log/${log.id}`);

  return (
    <div
      className="bg-white rounded-xl shadow-md cursor-pointer hover:shadow-lg p-4 mb-4"
      onClick={handleClick}
    >
      <h3 className="text-lg font-bold text-blue-700">{log.dive_title}</h3>
      <div className="text-sm text-gray-700 space-y-1 mt-2">
        <p className="flex items-center gap-2">
          <MapPin size={16} /> {log.dive_site}
        </p>
        <p className="flex items-center gap-2">
          <Calendar size={16} /> {log.dive_date}
        </p>
        <p className="flex items-center gap-2">
          <Droplet size={16} /> Max Depth: {log.max_depth}m
        </p>
        <p className="flex items-center gap-2">
          <Clock size={16} /> Bottom Time: {log.bottom_time}
        </p>
        <p className="flex items-center gap-2">
          <Cloud size={16} /> Weather: {log.weather}
        </p>
      </div>

      <div className="flex justify-between items-center mt-3">
        <span>By {usersMap?.[log.user] ?? 'Unknown'}</span>
        <span className="font-semibold">👍 {log.likes_count ?? 0}</span>
      </div>
    </div>
  );
}

export default DiveLogCard;
