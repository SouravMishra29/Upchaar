import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import Button from "../common/Button";
import LoginModal from "../ui/LoginModal";
import { motion } from "framer-motion";

function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const [openModal, setOpenModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    navigate("/");
  };

  return (
    <>
      {/* 🔥 NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-[100]">

        {/* GLASS BACKGROUND */}
        <div className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-gray-200/50 dark:border-gray-700/50">

          <div className="w-full max-w-[1400px] mx-auto px-2 sm:px-4 md:px-6 py-3 flex justify-between items-center">

            {/* LOGO */}
            <Link
              to="/"
              className="text-2xl font-bold text-primary tracking-tight hover:opacity-80 transition"
            >
              Upchaar
            </Link>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-3 sm:gap-4">

              {/* 🌗 THEME TOGGLE */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="px-3 py-1.5 rounded-xl text-sm
                  bg-white/60 dark:bg-gray-800/60
                  border border-gray-200 dark:border-gray-700
                  backdrop-blur-md
                  hover:shadow-md transition"
              >
                {dark ? "🌙 Dark" : "☀️ Light"}
              </motion.button>

              {!user ? (
                <>
                  {/* LOGIN */}
                  <button
                    onClick={() => setOpenModal(true)}
                    className="text-gray-700 dark:text-gray-300 text-sm font-medium
                      hover:text-primary transition"
                  >
                    Login
                  </button>

                  {/* REGISTER */}
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Button type="primary">
                      Register
                    </Button>
                  </motion.div>
                </>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setShowLogoutConfirm(true)}
                  className="px-4 py-1.5 text-sm font-medium rounded-xl
                    bg-red-500/10 text-red-500
                    hover:bg-red-500 hover:text-white
                    transition"
                >
                  Logout
                </motion.button>
              )}

            </div>
          </div>
        </div>
      </nav>

      {/* LOGIN MODAL */}
      <LoginModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
      />

      {/* 🔥 LOGOUT CONFIRM MODAL */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[200]">

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-[90%] max-w-sm shadow-xl border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Confirm Logout
            </h2>

            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              Are you sure you want to log out?
            </p>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-sm rounded-lg
                  bg-gray-200 dark:bg-gray-700
                  hover:opacity-80 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm rounded-lg
                  bg-red-500 text-white
                  hover:opacity-90 transition"
              >
                Logout
              </button>

            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}

export default Navbar;