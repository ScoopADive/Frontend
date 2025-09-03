import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Droplet, Clock, Cloud } from 'lucide-react';

// 최소 Card 컴포넌트
function Card({ children, className, onClick }) {
  return (
    <div
      className={`bg-white rounded-xl shadow-md cursor-pointer hover:shadow-lg transition ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

function CardContent({ children, className }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

function DiveLogCard({ log, usersMap }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/log/${log.id}`);
  };

  return (
    <Card className="rounded-2xl shadow-md bg-white" onClick={handleClick}>
      <CardContent className="p-4 space-y-3">
        {/* 제목 */}
        <h3 className="text-lg font-bold text-blue-700">{log.dive_title}</h3>

        {/* 주요 정보 */}
        <div className="text-sm text-gray-700 space-y-1">
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

        {/* 추가 정보 */}
        <div className="flex justify-between text-xs text-gray-500 mt-3">
          <span>Type: {log.type_of_dive}</span>
          <span>Weight: {log.weight}kg</span>
        </div>

        {/* 작성자 & 좋아요 */}
        <div className="flex justify-between items-center text-sm mt-2">
          <span className="font-medium">By {usersMap?.[log.user] ?? 'Unknown'}</span>
          <span className="text-blue-600">👍 {log.likes?.length ?? 0}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default DiveLogCard;
