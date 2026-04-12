import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function LoginModal({ isOpen, onClose }) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!form.email || !form.password) return;

    login(form); // 🔥 fake login
    onClose();
    navigate("/dashboard"); // Redirect to dashboard after login
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg">
        
        <h2 className="text-xl font-semibold text-center">
          Login
        </h2>

        <div className="mt-4 space-y-3">
          <input
            type="email"
            placeholder="Email"
            className="w-full border px-3 py-2 rounded"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border px-3 py-2 rounded"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button
            onClick={handleSubmit}
            className="w-full bg-primary text-white py-2 rounded"
          >
            Login
          </button>

          <button
            onClick={onClose}
            className="w-full text-gray-500 text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;