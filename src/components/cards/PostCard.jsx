import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

function PostCard({ post, isPopular = false }) {
  const { id, user, imageUrl, action, feeling, time, likes, comments, views } = post;
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/log/${id}`);
  };

  return (
    <div
      className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition"
      onClick={handleClick}
    >
      {/* 사용자 정보 */}
      <div className="p-4 border-b">
        <p className="text-gray-800 font-medium">
          <span className="text-blue-600">@{user}</span> {action}
        </p>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="flex flex-col gap-4 p-4">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={`${user}'s post`}
            className="w-full h-48 object-cover rounded-lg"
          />
        )}
        {feeling && (
          <div className="bg-[#eaf4fb] p-4 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-1">Feeling</h4>
            <p className="text-gray-600 text-sm">{feeling}</p>
          </div>
        )}
      </div>

      {/* 하단 메타정보 */}
      <div className="px-4 pb-4 text-sm text-gray-500">
        <p className={isPopular ? 'font-medium text-gray-700' : ''}>
          🔥 {likes ?? 0} Likes · {views ?? 0} Views · {comments ?? 0} Comments
        </p>
      </div>
    </div>
  );
}

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number.isRequired,
    user: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    action: PropTypes.string,
    feeling: PropTypes.string,
    time: PropTypes.string,
    likes: PropTypes.number,
    comments: PropTypes.number,
    views: PropTypes.number,
  }),
  isPopular: PropTypes.bool,
};

export default PostCard;
