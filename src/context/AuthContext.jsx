import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 🔥 Load user from localStorage (persist login)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 🔥 LOGIN
  const login = (data) => {
    const fakeUser = {
      name: data?.name || "Demo User",
      email: data?.email || "demo@email.com",
    };

    setUser(fakeUser);
    localStorage.setItem("user", JSON.stringify(fakeUser));
  };

  // 🔥 REGISTER
  const register = (data) => {
    const newUser = {
      name: data.name,
      email: data.email,
    };

    // In real app → send to backend
    console.log("Registered User:", newUser);

    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  // 🔥 LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user, // 🔥 useful flag
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 🔥 Custom Hook
export const useAuth = () => useContext(AuthContext);