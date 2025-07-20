import PropTypes from "prop-types";

function FriendSuggestionCard({ suggestions }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h3 className="text-lg font-semibold mb-2 text-gray-800">👥 Dive Buddies You May Like</h3>
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        {suggestions.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

FriendSuggestionCard.propTypes = {
  suggestions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default FriendSuggestionCard;
