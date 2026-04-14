const USE_MOCK = true; // 🔥 SWITCH THIS LATER WHEN BACKEND IS IMPLEMENTED TO USE ACTUAL DATA(true → false)

// ================= MOCK API =================

const mockLogin = async (credentials) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.email && credentials.password) {
        resolve({
          success: true,
          user: {
            id: 1,
            email: credentials.email,
            name: "Demo User",
          },
          token: "mock-token",
        });
      } else {
        reject({
          success: false,
          message: "Invalid credentials",
        });
      }
    }, 1000);
  });
};

const mockRegister = async (userData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        user: {
          id: 2,
          email: userData.email,
          name: userData.name,
        },
        token: "mock-token",
      });
    }, 1000);
  });
};

// ================= REAL API (FUTURE) =================

const realLogin = async (credentials) => {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  return res.json();
};

const realRegister = async (userData) => {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  return res.json();
};

// ================= EXPORTED FUNCTIONS =================

export const loginUser = (data) => {
  return USE_MOCK ? mockLogin(data) : realLogin(data);
};

export const registerUser = (data) => {
  return USE_MOCK ? mockRegister(data) : realRegister(data);
};

// Re-export from api.js for backward compatibility
export { loginUser, registerUser } from "./api";
