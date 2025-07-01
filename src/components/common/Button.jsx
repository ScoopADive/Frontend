import PropTypes from "prop-types";

function Button({ text, onClick, disabled = false, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition duration-200
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {text}
    </button>
  );
}

Button.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
};

export default Button;

