/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",   // ✅ FIXED POSITION

  content: ["./index.html", "./src/**/*.{js,jsx}"],

  theme: {
    extend: {
      colors: {
        primary: "#2EC4B6",
        secondary: "#4CAF50",
        accent: "#00B4D8",
        background: "#F7FAFC",
      },
    },
  },

  plugins: [],
};