import React, { useState, useEffect } from "react";
import {
  LogIn,
  Mail,
  Lock,
  Users,
  Shield,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    user_type: "0", // default Admin
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState("");

  // Handle Input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidationError("");
  };

  // Submit Handler
const handleSubmit = async () => {
  if (!formData.email || !formData.password) {
    setValidationError("Please fill all required fields");
    return;
  }
  if (!formData.email.includes("@")) {
    setValidationError("Please enter a valid email");
    return;
  }

  const payload = {
    action: "login",
    email: formData.email,
    password: formData.password,
    user_type: "0",
  };

  try {
    const resultAction = await dispatch(loginUser(payload));

    if (resultAction.meta.requestStatus === "fulfilled") {
      const { user, loginToken } = resultAction.payload;

      // Save token
      localStorage.setItem("token", loginToken);
      toast.success("Welcome to the admin dashboard");

      console.log("Login successful:", user);

      // Redirect to home
      navigate("/");
    } else {
      // Failed login
      setValidationError(resultAction.payload?.message || "Login failed");
      console.error("Login failed:", resultAction);
    }
  } catch (err) {
    console.error("Error during login:", err);
    setValidationError(err.message || "Something went wrong");
  }
};




  // If already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/");
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {/* <LogIn className="w-8 h-8 text-indigo-600" /> */}
            <img src="./logo.png" alt="" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {(validationError || error) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-800">
  {validationError || (typeof error === "string" ? error : error?.message)}
</div>

          </div>
        )}

        <div className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* User Type */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User Type *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { type: "0", label: "Admin", icon: Shield },
                { type: "1", label: "Vendor", icon: Users },
                { type: "3", label: "Demo", icon: LogIn },
              ].map((u) => {
                const Icon = u.icon;
                return (
                  <button
                    key={u.type}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, user_type: u.type }))
                    }
                    className={`py-3 px-4 rounded-lg border-2 transition-all text-center ${
                      formData.user_type === u.type
                        ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    <Icon className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-sm font-medium">{u.label}</div>
                  </button>
                );
              })}
            </div>
          </div> */}

          {/* Login Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Sign In
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
