import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CaptainDataContext } from "../context/CaptainContext";
import DarkModeToggle from "../components/DarkModeToggle";

const CaptainLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );
  
  const { setCaptain } = useContext(CaptainDataContext);

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
    const captainData = { email, password };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captains/login`,
        captainData
      );

      if (response.status === 200) {
        setCaptain(response.data.captain);
        localStorage.setItem("token", response.data.token);
        navigate("/captains/home");
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

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDarkMode(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="h-[100dvh] flex flex-col justify-center items-center px-4 py-8 bg-white dark:bg-black text-black dark:text-white transition-colors duration-500 relative">

      {/* back button */}
      <button
        onClick={() => navigate("/users/login")}
        className="absolute top-5 left-5 p-2.5 rounded-xl bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm hover:bg-white/20 dark:hover:bg-gray-800/20 transition-all duration-300 hover:scale-105 hover:shadow-lg border border-gray-200/20 dark:border-gray-700/20"
        aria-label="Go back"
      >
        <i className="ri-arrow-left-line text-xl"></i>
      </button>

      <div className="absolute top-5 right-5 z-50">
        <DarkModeToggle />
      </div>

      <div className="w-full max-w-md bg-gray-50 dark:bg-gray-900 shadow-[0_15px_15px_rgba(0,0,0,0.4)] dark:shadow-[0_15px_15px_rgba(255,255,255,0.4)] rounded-2xl p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-wide">Kuber</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Welcome! Please login to your Captain account
          </p>
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
                errors.email
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-700"
              } bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-[0_10px_20px_rgba(0,0,0,0.3)] dark:shadow-[0_5px_5px_rgba(255,255,255,0.3)]`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-2 font-medium text-lg"
            >
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
                errors.password
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-700"
              } bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-[0_10px_20px_rgba(0,0,0,0.3)] dark:shadow-[0_5px_5px_rgba(255,255,255,0.3)]`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {errors.general && (
            <p className="mt-2 text-sm text-red-500">{errors.general}</p>
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
          <Link
            to="/captains/register"
            className="text-blue-500 font-semibold hover:underline"
          >
            Register as Captain
          </Link>
        </p>
      </div>

      <Link
        to="/users/login"
        className="mt-12 w-full max-w-md py-3 bg-green-600 text-white text-center font-bold text-lg rounded-lg hover:bg-green-700 transition duration-300 shadow-[0_5px_15px_rgba(0,0,0,0.4)] dark:shadow-[0_5px_15px_rgba(255,255,255,0.4)]"
      >
        Sign in as User
      </Link>

      <p className="text-xs text-center mt-8 max-w-sm text-gray-500 dark:text-gray-400">
        By proceeding, you consent to receive calls, WhatsApp, or SMS messages,
        including via automated means, from Kuber and its affiliates to the
        number provided.
      </p>
    </section>
  );
};

export default CaptainLogin;
