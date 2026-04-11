function Button({ children, type = "primary", onClick, loading }) {
  const base =
    "w-full px-5 py-2 rounded-lg font-medium transition disabled:opacity-60";

  const styles = {
    primary: "bg-primary text-white hover:bg-teal-600",
    secondary: "bg-secondary text-white hover:bg-green-600",
    outline:
      "border border-primary text-primary hover:bg-primary hover:text-white",
  };

  return (
    <button
      className={`${base} ${styles[type]}`}
      onClick={onClick}
      disabled={loading}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}

export default Button;