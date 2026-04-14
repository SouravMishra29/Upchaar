import { createContext, useContext, useState, useEffect } from "react";
import { fetchProfile } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── helpers ────────────────────────────────
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // ── Restore session on app load ────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    const stored = localStorage.getItem("user");

    if (token && stored) {
      // Immediately show stored user so UI doesn't flash
      try { setUser(JSON.parse(stored)); } catch {}

      // Re-validate token with backend in background
      fetchProfile()
        .then((res) => {
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem("user", JSON.stringify(res.user));
          } else if (res.error?.includes("expired") || res.error?.includes("authenticated")) {
            // Only clear session if token is truly invalid
            logout();
          }
          // For other errors (network down, etc.) keep the stored session
        })
        .catch(() => {
          // Backend unreachable — keep local session, don't log out
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // ── login: called after successful /api/auth/login ──
  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    if (token) localStorage.setItem("token", token);
  };

  // ── register: same shape as login ──────────
  const register = (userData, token) => {
    login(userData, token);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
