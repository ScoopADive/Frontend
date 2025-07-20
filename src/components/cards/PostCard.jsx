import PropTypes from "prop-types";

function PostCard({ post, isPopular = false }) {
  const { user, imageUrl, action, feeling, time, likes, comments, views } = post;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* 사용자 정보 */}
      <div className="p-4 border-b">
        <p className="text-gray-800 font-medium">
          <span className="text-blue-600">@{user}</span> {action}
        </p>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="flex flex-col gap-4 p-4">
        <img
          src={imageUrl}
          alt={`${user}'s post`}
          className="w-full h-48 object-cover rounded-lg"
        />
        <div className="bg-[#eaf4fb] p-4 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-1">Feeling</h4>
          <p className="text-gray-600 text-sm">{feeling}</p>
        </div>
      </div>

      {/* 하단 메타정보 */}
      <div className="px-4 pb-4 text-sm text-gray-500">
        {isPopular ? (
          <p className="font-medium text-gray-700">
            🔥 {likes} Likes · {views} Views · {comments} Comments
          </p>
        ) : (
          <p>3 Likes · 2 Comments</p>
        )}
      </div>
    </div>
  );
}

PostCard.propTypes = {
  post: PropTypes.shape({
    user: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    action: PropTypes.string.isRequired,
    feeling: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    likes: PropTypes.number,
    comments: PropTypes.number,
    views: PropTypes.number,
  }),
  isPopular: PropTypes.bool,
};

export default PostCard;
