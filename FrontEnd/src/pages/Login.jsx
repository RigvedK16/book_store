import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "../utils/api";
import { useDispatch } from "react-redux";
import { setUser, setError as setReduxError } from "../redux/authSlice";
import { FaBook, FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const [emailId, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormError("");

    if (!emailId || !password) {
      setFormError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const response = await api("/login", {
        method: "POST",
        body: { emailId, password },
      });

      dispatch(setUser(response.user));
      const redirectTo = location.state?.from?.pathname || "/home";
      navigate(redirectTo, { replace: true });

    } catch (err) {
      setFormError(err.message || "Login failed. Please check your credentials.");
      dispatch(setReduxError(err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 text-black flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
              <FaBook className="text-white text-xl" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
              BookStore
            </span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
          <p className="text-gray-600 mt-2">Sign in to continue your reading journey</p>
        </div>

        {/* Login Card */}
        <div className="card bg-white shadow-2xl rounded-2xl border border-gray-100">
          <div className="card-body p-8">
            <form className="flex flex-col gap-5" onSubmit={submit}>

              {/* Email Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-gray-700">Email Address</span>
                </label>
                <input
                  value={emailId}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="you@example.com"
                  className="input input-bordered w-full bg-white text-gray-900 placeholder-gray-400 border-gray-300 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  required
                  autoComplete="email"
                />
              </div>

              {/* Password Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-gray-700">Password</span>
                </label>
                <div className="relative">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="input input-bordered w-full bg-white text-gray-900 placeholder-gray-400 border-gray-300 pr-10 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-transparent"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <label className="label">
                  <Link to="/forgot-password" className="label-text-alt link link-hover text-emerald-600 hover:text-emerald-700">
                    Forgot password?
                  </Link>
                </label>
              </div>

              {/* Error Message */}
              {formError && (
                <div className="alert alert-error text-sm py-3 bg-red-50 text-red-700 border border-red-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{formError}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                className="btn bg-gradient-to-r from-emerald-500 to-cyan-600 border-none text-white font-medium py-3 hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Sign In"
                )}
              </button>

              {/* Divider */}
              <div className="divider text-gray-400">or</div>

              {/* Sign Up Link */}
              <div className="text-center">
                <p className="text-gray-600">
                  New to BookStore?{" "}
                  <Link to="/signup" className="link link-hover text-emerald-600 font-medium hover:text-emerald-700">
                    Create a free account
                  </Link>
                </p>
              </div>
            </form>

            {/* Trust Badges */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">🔒 Secure</span>
                <span className="flex items-center gap-1">📚 10K+ Books</span>
                <span className="flex items-center gap-1">🚚 Free Shipping</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          By signing in, you agree to our{" "}
          <Link to="/terms" className="link link-hover text-gray-500 hover:text-gray-600">Terms</Link> and{" "}
          <Link to="/privacy" className="link link-hover text-gray-500 hover:text-gray-600">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}