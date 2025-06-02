function Button({ text, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-600 transition duration-200
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {text}
    </button>
  );
}

export default Button;

