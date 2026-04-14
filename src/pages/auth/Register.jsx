import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { useAuth } from "../../context/AuthContext";
import { registerUser } from "../../services/api";

function Register() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", age: "", gender: "", bloodGroup: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password || formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      const res = await registerUser(formData);

      if (res.success) {
        register(res.user, res.token);
        navigate("/dashboard");
      } else {
        setErrors({ general: res.message || "Registration failed" });
      }
    } catch (err) {
      console.error("Register Error:", err);
      setErrors({ general: "Server error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Create Account 🏥</h2>
        <p className="text-center text-gray-500 mt-1">Join HealthcareAI today</p>

        <div className="mt-6 space-y-4">
          <Input label="Full Name" type="text" name="name" placeholder="Your name" value={formData.name} onChange={handleChange} error={errors.name} />
          <Input label="Email" type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} error={errors.email} />
          <Input label="Password" type="password" name="password" placeholder="Min. 6 characters" value={formData.password} onChange={handleChange} error={errors.password} />

          <div className="grid grid-cols-2 gap-3">
            <Input label="Age" type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary">
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <Input label="Blood Group" type="text" name="bloodGroup" placeholder="e.g. A+, O-" value={formData.bloodGroup} onChange={handleChange} />

          {errors.general && <p className="text-red-500 text-sm text-center">{errors.general}</p>}

          <Button onClick={handleSubmit} loading={loading}>Register</Button>
        </div>

        <p className="text-sm text-center text-gray-500 mt-6">
          Already have an account?{" "}
          <span className="text-primary cursor-pointer hover:underline" onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>
    </div>
  );
}

export default Register;
