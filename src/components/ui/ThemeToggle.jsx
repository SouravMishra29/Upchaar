import { useTheme } from "../../context/ThemeContext";

function ThemeToggle() {
  const { dark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white text-sm transition"
    >
      {dark ? "🌙 Dark" : "☀ Light"}
    </button>
  );
}

export default ThemeToggle;