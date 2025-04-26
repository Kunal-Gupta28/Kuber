import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";
import DarkModeToggle from "../components/DarkModeToggle";

const UserSignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { setUser } = useContext(UserDataContext);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!emailRegex.test(email)) newErrors.email = "Invalid email address.";
    if (!password) newErrors.password = "Password is required.";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formHandler = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newUserData = {
      fullname: { firstname: firstName, lastname },
      email,
      password,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/register`,
        newUserData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 201) {
        const data = response.data;
        setUser(data.user);
        localStorage.setItem("token", data.token);
        navigate("/home");
        setFirstName("");
        setLastname("");
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      console.error("Registration error:", error.response?.data || error);
    }
  };

  return (
    <section className="h-[100dvh] flex flex-col justify-center items-center px-4 py-10 bg-white dark:bg-black text-black dark:text-white transition-colors duration-500">
      <div className="absolute top-5 right-5">
        <DarkModeToggle />
      </div>

      <div className="w-full max-w-md bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 shadow-xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-wide">Kuber</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Create your account
          </p>
        </header>

        <form onSubmit={formHandler} className="space-y-6">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-1/2 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className="w-1/2 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.email
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-700"
              } bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none`}
              required
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.password
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-700"
              } bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none`}
              required
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 font-bold rounded-lg transition duration-300 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link
            to="/users/login"
            className="text-blue-500 font-semibold hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>

      <Link
        to="/captains/register"
        className="mt-6 w-full max-w-md py-3 bg-green-600 text-white text-center font-bold text-lg rounded-lg hover:bg-green-700 transition duration-300"
      >
        Register as Captain
      </Link>

      <p className="text-xs text-center mt-8 max-w-sm text-gray-500 dark:text-gray-400">
        By proceeding, you consent to receive calls, WhatsApp, or SMS messages,
        including via automated means, from Kuber and its affiliates to the
        number provided.
      </p>
    </section>
  );
};

export default UserSignUp;
