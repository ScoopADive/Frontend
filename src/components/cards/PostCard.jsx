import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

function PostCard({ post, usersMap, isPopular = false }) {
  const navigate = useNavigate();
  const { id, user, dive_image, feeling, dive_title, dive_date, likes } = post;

  // username 없으면 Unknown
  const displayName = user ? (usersMap[user] ?? `user${user}`) : 'Unknown';
  const likesCount = Array.isArray(likes) ? likes.length : 0;

  const handleClick = () => {
    navigate(`/log/${id}`);
  };

  return (
    <div
      className="bg-white rounded-xl overflow-hidden cursor-pointer transition-none"
      onClick={handleClick}
    >
      {/* 제목 + 작성자 */}
      <div className="p-4">
        <p className="text-gray-800 font-medium">
          <span className="text-blue-600">{dive_title}</span>
          <span className="text-gray-500 ml-2">@{displayName}</span>
        </p>
        {dive_date && <p className="text-xs text-gray-400 mt-1">{dive_date}</p>}
      </div>

      {/* 이미지 */}
      {dive_image && (
        <div className="flex flex-col gap-4 p-4">
          <img
            src={dive_image}
            alt={`${displayName}'s dive`}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Feeling */}
      {feeling && (
        <div className="flex flex-col gap-4 p-4">
          <div className="bg-[#eaf4fb] p-4 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-1">Feeling</h4>
            <p className="text-gray-600 text-sm">{feeling}</p>
          </div>
        </div>
      )}

      {/* 하단 메타 */}
      <div className="px-4 pb-4 text-sm text-gray-500">
        <p className={isPopular ? 'font-medium text-gray-700' : ''}>
          🔥 {likesCount} Likes · 0 Views · 0 Comments
        </p>
      </div>
    </div>
  );
}

PostCard.propTypes = {
  post: PropTypes.object.isRequired,
  usersMap: PropTypes.object.isRequired,
  isPopular: PropTypes.bool,
};

export default PostCard;
