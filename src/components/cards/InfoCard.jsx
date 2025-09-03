import PropTypes from 'prop-types';

function InfoCard({ title, icon, items, ordered = false }) {
  const ListTag = ordered ? 'ol' : 'ul';

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h3 className="text-lg font-semibold mb-2 text-gray-800">
        {icon} {title}
      </h3>
      <ListTag
        className={`list-${ordered ? 'decimal' : 'disc'} list-inside text-gray-700 space-y-1`}
      >
        {items.map((item, idx) => (
          <li key={idx} className="flex justify-between items-center">
            <span>
              {typeof item === 'string'
                ? item
                : item.name || item.location
                  ? `${item.name ?? item.location}${item.country ? ` (${item.country})` : ''}`
                  : ''}
            </span>
            {typeof item !== 'string' && item.count !== undefined && (
              <span
                className={`${
                  item.count > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-500'
                } text-xs font-medium px-2 py-0.5 rounded-full`}
              >
                {item.count}
              </span>
            )}
          </li>
        ))}
      </ListTag>
    </div>
  );
}

InfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        name: PropTypes.string,
        location: PropTypes.string,
        country: PropTypes.string,
        count: PropTypes.number,
      }),
    ]),
  ).isRequired,
  ordered: PropTypes.bool,
};

export default InfoCard;
