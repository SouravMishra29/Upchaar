import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/api";

function LoginModal({ isOpen, onClose, switchToRegister }) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]       = useState({ email: "", password: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    const res = await loginUser(form);

    setLoading(false);

    if (res.success) {
      login(res.user, res.token);
      onClose();
      navigate("/dashboard");
    } else {
      setError(res.message || res.error || "Invalid email or password.");
    }
  };

  const handleKey = (e) => { if (e.key === "Enter") handleSubmit(); };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
         onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg">

        <h2 className="text-xl font-semibold text-center text-gray-800 mb-1">Welcome Back 👋</h2>
        <p className="text-center text-gray-500 text-sm mb-5">Login to your account</p>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" name="email" placeholder="Enter your email"
              value={form.email} onChange={handleChange} onKeyDown={handleKey}
              className="w-full border border-gray-300 px-3 py-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" name="password" placeholder="Enter your password"
              value={form.password} onChange={handleChange} onKeyDown={handleKey}
              className="w-full border border-gray-300 px-3 py-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary" />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3 py-2">
              ⚠️ {error}
            </div>
          )}

          <button onClick={handleSubmit} disabled={loading}
            className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2">
            {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {loading ? "Logging in..." : "Login"}
          </button>

          {switchToRegister && (
            <p className="text-center text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <span onClick={() => { onClose(); switchToRegister(); }}
                className="text-primary cursor-pointer font-medium hover:underline">
                Register
              </span>
            </p>
          )}

          <button onClick={onClose} className="w-full text-gray-400 text-sm hover:text-gray-600 transition">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
