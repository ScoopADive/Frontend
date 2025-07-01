import PropTypes from "prop-types";

function Input({
  label,
  name,
  value,
  onChange,
  onKeyDown,
  type = "text",
  placeholder,
  id,
}) {
  const inputId = id || name;

  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={inputId}
          className="block mb-1 text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      />
    </div>
  );
}

Input.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  id: PropTypes.string,
};

export default Input;
