// ─────────────────────────────────────────────
// 🔌 CENTRAL API CONFIGURATION
// ─────────────────────────────────────────────
// Change BASE_URL to your deployed backend URL when going to production.

export const BASE_URL = "http://localhost:3001";

export const API_ROUTES = {
  // Auth
  LOGIN: `${BASE_URL}/api/auth/login`,
  REGISTER: `${BASE_URL}/api/auth/register`,
  ME: `${BASE_URL}/api/auth/me`,
  UPDATE_PROFILE: `${BASE_URL}/api/auth/me`,

  // Chat
  CHAT: `${BASE_URL}/chat`,

  // Records
  RECORDS: `${BASE_URL}/api/records`,

  // Prediction
  PREDICTION: `${BASE_URL}/api/prediction`,
};

// Helper: returns Authorization header if token exists
export function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}
