import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function RegisterModal({ isOpen, onClose, switchToLogin }) {
  const { register } = useAuth(); // 🔥 you will create this in context
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    )
      return;

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    register(form); // 🔥 fake register
    onClose();
    navigate("/dashboard");
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg">
        
        <h2 className="text-xl font-semibold text-center">
          Create Account
        </h2>

        <div className="mt-4 space-y-3">

          <input
            type="text"
            placeholder="Full Name"
            className="w-full border px-3 py-2 rounded"
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

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

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full border px-3 py-2 rounded"
            onChange={(e) =>
              setForm({
                ...form,
                confirmPassword: e.target.value,
              })
            }
          />

          <button
            onClick={handleSubmit}
            className="w-full bg-primary text-white py-2 rounded"
          >
            Register
          </button>

          {/* 🔥 Switch to login */}
          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <span
              onClick={() => {
                onClose();
                switchToLogin(); // 🔥 open login modal
              }}
              className="text-primary cursor-pointer font-medium"
            >
              Login
            </span>
          </p>

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

export default RegisterModal;