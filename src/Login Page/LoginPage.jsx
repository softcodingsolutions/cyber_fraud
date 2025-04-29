import React, { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import poster from "../Assets/poster.jpg";
import axios from "axios"; // Import axios
import "../output.css"; // Import your CSS file

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // To display error messages

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login attempt with:", email, password);

    try {
      // Now using the relative URL since the baseURL is set
      const response = await axios.post("/adminlogin", {
        email,
        password,
      });

      const { accesstoken, refreshtoken, role } = response.data;
      console.log("Access Token:", accesstoken);
      console.log("Refresh Token:", refreshtoken);
      console.log("Role:", role);

      // Set a default role as "Admin" if not present
      const userRole = role || "Admin";

      // You can store tokens and role in localStorage
      localStorage.setItem("access_token", accesstoken);
      localStorage.setItem("refresh_token", refreshtoken);
      localStorage.setItem("role", userRole); // Store the role in localStorage

      // Optionally redirect or show success message here
      window.location.href = "/dashboard"; // Redirect to another page, e.g., admin dashboard
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        setErrorMessage(error.response.data.message || "Something went wrong!");
      } else {
        // Network or other error
        setErrorMessage("Network error. Please try again.");
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl flex flex-col md:flex-row transition-transform hover:scale-[1.01]">
        {/* Left Side - Image */}
        <div className="md:w-1/2 hidden md:block relative">
          <img
            src={poster}
            alt="Login Illustration"
            className="w-full h-full object-cover rounded-l-2xl"
          />
        </div>

        {/* Right Side - Form */}
        <div className="md:w-1/2 w-full p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-3xl font-extrabold text-blue-600 mb-2">
              Sign In
            </h1>
            <p className="text-gray-500">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Display Error Message */}
          {errorMessage && (
            <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-full p-1"
                >
                  {showPassword ? (
                    <EyeOffIcon size={20} />
                  ) : (
                    <EyeIcon size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
