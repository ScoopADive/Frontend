function Input({ label, value, onChange, onKeyDown, type = "text", placeholder }) {
  return (
    <div className="mb-4">
      {label && <label className="block mb-1 text-sm font-medium text-gray-700">{label}</label>}
      <input
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

export default Input;
