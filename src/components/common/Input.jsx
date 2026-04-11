function Input({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  error,
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-600 font-medium">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border rounded-lg outline-none transition
          ${error ? "border-red-500" : "border-gray-300"}
          focus:border-primary`}
      />

      {error && (
        <span className="text-sm text-red-500">{error}</span>
      )}
    </div>
  );
}

export default Input;