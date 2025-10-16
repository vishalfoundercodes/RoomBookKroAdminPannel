import React, { useState } from 'react';
import { LogIn, Mail, Lock, Users, Shield, AlertCircle, Eye, EyeOff } from 'lucide-react';

// Simulated auth hook
const useAuth = () => {
  const [state, setState] = useState({
    loading: false,
    error: null,
    user: null,
    isAuthenticated: false,
  });

  const loginUser = async (payload) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock response
      const mockResponse = {
        success: true,
        user: {
          email: payload.email,
          user_type: payload.user_type,
          name: payload.user_type === "0"
            ? "Admin User"
            : payload.user_type === "1"
            ? "Vendor User"
            : "Demo User",
          token: "mock_jwt_token_" + Date.now()
        }
      };

      setState({
        loading: false,
        error: null,
        user: mockResponse.user,
        isAuthenticated: true
      });

      return mockResponse;
    } catch (err) {
      setState(prev => ({ ...prev, loading: false, error: err.message }));
      throw err;
    }
  };

  return { ...state, loginUser };
};

export default function Login() {
  const { loading, error, user, isAuthenticated, loginUser } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    user_type: '0', // default Vendor
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setValidationError('');
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.email || !formData.password) {
      setValidationError('Please fill all required fields');
      return;
    }
    if (!formData.email.includes('@')) {
      setValidationError('Please enter a valid email');
      return;
    }

    try {
      await loginUser(formData);
      console.log('Login successful:', formData);
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Successful!</h2>
          <p className="text-gray-600 mb-4">Welcome back, {user.name}</p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <div className="text-sm text-gray-600 mb-2">User Details:</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Email:</span> <span className="font-medium">{user.email}</span></div>
              <div className="flex justify-between"><span>User Type:</span> <span className="font-medium">{user.user_type === "0" ? "Admin" : user.user_type === "1" ? "Vendor" : "Demo"}</span></div>
              <div className="flex justify-between"><span>Token:</span> <span className="font-mono text-xs">{user.token.substring(0,20)}...</span></div>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {(validationError || error) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-800">{validationError || error}</div>
          </div>
        )}

        <div className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
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
                {showPassword ? <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600"/> : <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600"/>}
              </button>
            </div>
          </div>

          {/* User Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">User Type *</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { type: '0', label: 'Admin', icon: Shield },
                { type: '1', label: 'Vendor', icon: Users },
                { type: '3', label: 'Demo', icon: LogIn }
              ].map(u => {
                const Icon = u.icon;
                return (
                  <button
                    key={u.type}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, user_type: u.type }))}
                    className={`py-3 px-4 rounded-lg border-2 transition-all text-center ${
                      formData.user_type === u.type
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <Icon className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-sm font-medium">{u.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

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
