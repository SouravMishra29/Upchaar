import { Routes, Route } from "react-router-dom";

// Pages
import Home from "../pages/general/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Chatbot from "../pages/general/chatbot";
import Dashboard from "../pages/dashboard/Dashboard";
import Profile from "../pages/patient/Profile";
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/chat" element={<Chatbot />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default AppRoutes;