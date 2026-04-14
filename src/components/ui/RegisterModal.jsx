import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/api";

function RegisterModal({ isOpen, onClose, switchToLogin }) {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]       = useState({ name: "", email: "", password: "", confirmPassword: "", age: "", gender: "", bloodGroup: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    // Send to backend (exclude confirmPassword)
    const { confirmPassword, ...payload } = form;
    const res = await registerUser(payload);

    setLoading(false);

    if (res.success) {
      register(res.user, res.token);
      onClose();
      navigate("/dashboard");
    } else {
      setError(res.message || res.error || "Registration failed. Try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 overflow-y-auto py-6"
         onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg">

        <h2 className="text-xl font-semibold text-center text-gray-800 mb-1">Create Account 🏥</h2>
        <p className="text-center text-gray-500 text-sm mb-5">Join Upchaar today</p>

        <div className="space-y-3">

          {/* Required fields */}
          {[
            { label: "Full Name *",  name: "name",     type: "text",     placeholder: "Your full name" },
            { label: "Email *",      name: "email",    type: "email",    placeholder: "Enter your email" },
            { label: "Password *",   name: "password", type: "password", placeholder: "Min. 6 characters" },
            { label: "Confirm Password *", name: "confirmPassword", type: "password", placeholder: "Re-enter password" },
          ].map(({ label, name, type, placeholder }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input type={type} name={name} placeholder={placeholder}
                value={form[name]} onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary" />
            </div>
          ))}

          {/* Optional fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input type="number" name="age" placeholder="Age" value={form.age} onChange={handleChange} min="0" max="120"
                className="w-full border border-gray-300 px-3 py-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
              <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary">
                <option value="">Select</option>
                {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select name="gender" value={form.gender} onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary">
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3 py-2">
              ⚠️ {error}
            </div>
          )}

          <button onClick={handleSubmit} disabled={loading}
            className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2">
            {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {loading ? "Creating account..." : "Create Account"}
          </button>

          {switchToLogin && (
            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <span onClick={() => { onClose(); switchToLogin(); }}
                className="text-primary cursor-pointer font-medium hover:underline">
                Login
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

export default RegisterModal;
