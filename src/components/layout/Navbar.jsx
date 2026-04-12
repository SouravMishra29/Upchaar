import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import Button from "../common/Button";
import LoginModal from "../ui/LoginModal";
import RegisterModal from "../ui/RegisterModal";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    navigate("/");
  };

  return (
    <>
      {/* 🔥 NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-[100]">
        <div className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-gray-200/50 dark:border-gray-700/50">

          <div className="w-full max-w-[1400px] mx-auto px-2 sm:px-4 md:px-6 py-3 flex justify-between items-center">

            {/* LOGO */}
            <span
              onClick={() => {
                if (window.location.pathname === "/dashboard") {
                  // 🔥 Soft refresh (no reload)
                  navigate("/dashboard", { state: { refresh: true } });
                } else if (window.location.pathname === "/") {
                  const el = document.getElementById("hero");
                  if (el) {
                    const yOffset = -80;
                    const y =
                      el.getBoundingClientRect().top +
                      window.pageYOffset +
                      yOffset;
                  
                    window.scrollTo({ top: y, behavior: "smooth" });
                  }
                } else {
                  navigate("/#hero");
                }
              }}
              className="text-2xl font-bold text-primary tracking-tight hover:opacity-80 transition cursor-pointer"
            >
              Upchaar
            </span>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-3 sm:gap-4">

              {/* 🌗 THEME */}
              <div
                onClick={toggleTheme}
                className="w-14 h-8 flex items-center bg-gray-200 dark:bg-gray-700 rounded-full p-1 cursor-pointer transition"
              >
                <motion.div
                  layout
                  className="w-6 h-6 bg-white dark:bg-gray-900 rounded-full shadow-md flex items-center justify-center text-sm"
                  animate={{
                    x: dark ? 24 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {dark ? "🌙" : "☀️"}
                </motion.div>
              </div>

              {!user || !isDashboard ? (
                <>
                  {/* LOGIN */}
                  <button
                    onClick={() => setShowLogin(true)}
                    className="text-gray-700 dark:text-gray-300 text-sm font-medium hover:text-primary"
                  >
                    Login
                  </button>
                            
                  {/* REGISTER */}
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Button onClick={() => setShowRegister(true)} type="primary">
                      Register
                    </Button>
                  </motion.div>
                </>
              ) : (
                <div className="relative">

  {/* PROFILE BUTTON */}
  <div
    onClick={() => setShowProfileMenu((prev) => !prev)}
    className="flex items-center gap-2 px-3 py-1.5 rounded-xl cursor-pointer
      bg-white/60 dark:bg-gray-800/60
      border border-gray-200 dark:border-gray-700
      backdrop-blur-md hover:shadow-md transition"
  >
    {/* Avatar */}
    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
          {user?.name?.[0] || "U"}
        </div>
                  
        {/* Name (optional) */}
        <span className="hidden sm:block text-sm text-gray-700 dark:text-gray-200">
          {user?.name || "User"}
        </span>
      </div>
                  
      {/* DROPDOWN */}
      {showProfileMenu && (
        <div className="absolute right-0 mt-2 w-44 rounded-xl shadow-lg
          bg-white dark:bg-gray-900
          border border-gray-200 dark:border-gray-700
          overflow-hidden z-[300]">
          
          {/* MY PROFILE */}
          <button
            onClick={() => {
              setShowProfileMenu(false);
              window.dispatchEvent(new CustomEvent("openProfile"));
            }}
            className="w-full text-left px-4 py-2 text-sm
              text-gray-700 dark:text-gray-200
              hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            My Profile
          </button>
          
          {/* DIVIDER */}
          <div className="h-px bg-gray-200 dark:bg-gray-700" />
          
          {/* LOGOUT */}
          <button
            onClick={() => {
              setShowProfileMenu(false);
              setShowLogoutConfirm(true);
            }}
            className="w-full text-left px-4 py-2 text-sm
              text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
          >
            Logout
          </button>
          
        </div>
      )}
    
    </div>
              )}

            </div>
          </div>
        </div>
      </nav>

      {/* 🔥 LOGIN MODAL */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
      />

      {/* 🔥 REGISTER MODAL */}
      <RegisterModal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        switchToLogin={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
      />

      {/* 🔥 LOGOUT CONFIRM */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-[200]">
        
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            className="w-[90%] max-w-sm rounded-2xl p-6 shadow-2xl
              bg-white/90 dark:bg-gray-900/80
              backdrop-blur-xl
              border border-gray-200 dark:border-gray-700"
          >
            {/* HEADER */}
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Confirm Logout
            </h2>
            
            {/* DESCRIPTION */}
            <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">
              Are you sure you want to log out?
            </p>
            
            {/* ACTIONS */}
            <div className="flex justify-end gap-3 mt-6">
            
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-sm rounded-lg
                  bg-gray-200 text-gray-800
                  dark:bg-gray-700 dark:text-gray-200
                  hover:opacity-80 transition"
              >
                Cancel
              </button>
            
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm rounded-lg
                  bg-red-500 text-white
                  hover:bg-red-600 transition shadow-md"
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