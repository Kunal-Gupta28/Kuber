import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUserContext } from "../context/UserContext";
import { useTheme } from "../context/ThemeContext";

const UserLogin = () => {
  const { setUser } = useUserContext();
  const { isDarkMode, toggleTheme } = useTheme();

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!emailRegex.test(email))
      newErrors.email = "Invalid email address.";

    if (!password) newErrors.password = "Password is required.";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const userData = { email, password };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/login`,
        userData
      );

      if (response.status === 200) {
        setUser(response.data.user);
        localStorage.setItem("token", response.data.token);
        navigate("/home");
      }
    } catch (error) {
      console.error("Login failed:", error.response);

      if (error.response && error.response.data) {
        if (error.response.data.message === "Invalid username or password") {
          setErrors({
            email: "Invalid email or password.",
            password: "Invalid email or password.",
          });
        } else {
          setErrors({ general: "An error occurred. Please try again later." });
        }
      } else {
        setErrors({ general: "An error occurred. Please try again later." });
      }
    } finally {
      setLoading(false);
    }

    setEmail("");
    setPassword("");
  };

  return (
    <section className="h-[100dvh] flex flex-col justify-center items-center px-4 py-10 bg-white dark:bg-black text-black dark:text-white transition-colors duration-500 relative">
      <div className="absolute top-5 right-5">
        <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-300 dark:bg-gray-700">
          {isDarkMode ? "🌙" : "☀️"}
        </button>
      </div>

      <div className="w-full max-w-md bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 shadow-[0_15px_15px_rgba(0,0,0,0.4)] dark:shadow-[0_15px_15px_rgba(255,255,255,0.4)] transition-all duration-500">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-wide">Kuber</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Welcome! Please login</p>
        </header>

        <form onSubmit={formHandler} className="space-y-6">
          <div>
            <label htmlFor="email" className="block mb-2 font-medium text-lg">
              Enter Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={handleEmail}
              placeholder="you@example.com"
              aria-label="Email"
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-700"
              } bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-[0_10px_20px_rgba(0,0,0,0.3)] dark:shadow-[0_5px_5px_rgba(255,255,255,0.3)]`}
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 font-medium text-lg">
              Enter Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={handlePassword}
              placeholder="••••••••"
              aria-label="Password"
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.password ? "border-red-500" : "border-gray-300 dark:border-gray-700"
              } bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-[0_10px_20px_rgba(0,0,0,0.3)] dark:shadow-[0_5px_5px_rgba(255,255,255,0.3)]`}
            />
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
          </div>

          {errors.general && (
            <p className="mt-2 text-sm text-red-500 text-center">{errors.general}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 font-bold rounded-lg transition duration-300 ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            } text-white shadow-[0_5px_20px_rgba(0,0,0,0.3)] dark:shadow-[0_5px_20px_rgba(255,255,255,0.3)] `}
          >
            {loading ? "Logging In..." : "Log In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          New to Kuber?{" "}
          <Link to="/users/register" className="text-blue-500 font-semibold hover:underline">
            Register as New User
          </Link>
        </p>
      </div>

      <Link
        to="/captains/login"
        className="mt-12 w-full max-w-md py-3 bg-green-600 text-white text-center font-bold text-lg rounded-lg hover:bg-green-700 transition duration-300 shadow-[0_5px_15px_rgba(0,0,0,0.4)] dark:shadow-[0_5px_15px_rgba(255,255,255,0.4)]"
      >
        Sign in as Captain
      </Link>

      <p className="text-xs text-center mt-8 max-w-sm text-gray-500 dark:text-gray-400">
        By proceeding, you consent to receive calls, WhatsApp, or SMS messages, including via automated means, from Kuber and its affiliates to the number provided.
      </p>
    </section>
  );
};

export default UserLogin;
