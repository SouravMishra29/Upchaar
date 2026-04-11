import { useState } from "react";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../services/authService";

/* =========================
   🔌 BACKEND CONFIG (EDIT ONLY THIS IF NEEDED)
========================= */

const LOGIN_CONFIG = {
  endpoint: "LOGIN",
  method: "POST",
};

/* ========================= */

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Remove error while typing
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  // Validation
  const validate = () => {
    let newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  // Submit handler
  const handleSubmit = async () => {
    const res = await loginUser(formData);

    if (res.success) {
      login(res.user); // 🔥 THIS IS IMPORTANT
    }
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      const { login } = useAuth();

      if (res.success) {
        console.log("User:", res.user);
      } else {
        throw new Error(res.message);
      }

      console.log("Login Success:", res);

      // future: redirect or store token

    } catch (err) {
      console.error("Login Error:", err);

      setErrors({
        general: "Invalid credentials or server error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Welcome Back 👋
        </h2>

        <p className="text-center text-gray-500 mt-1">
          Login to continue
        </p>

        <div className="mt-6 space-y-4">

          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />

          {errors.general && (
            <p className="text-red-500 text-sm text-center">
              {errors.general}
            </p>
          )}

          <Button onClick={handleSubmit} loading={loading}>
            Login
          </Button>
        </div>

        <p className="text-sm text-center text-gray-500 mt-6">
          Don’t have an account?{" "}
          <span className="text-primary cursor-pointer">
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;