import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CaptainDataContext } from "../context/CaptainContext";
import DarkModeToggle from "../components/DarkModeToggle";

const CaptainSignUp = () => {
  const navigate = useNavigate();
  const { setCaptain } = useContext(CaptainDataContext);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    vehicleColor: "",
    vehiclePlate: "",
    vehicleCapacity: "",
    vehicleType: "",
  });

  const [errors, setErrors] = useState({});
  const MAX_PLATE_LENGTH = 8;
  const vehiclePlateRegex = /^[A-Za-z0-9]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.firstName) newErrors.firstName = "First name is required.";
    if (!form.lastName) newErrors.lastName = "Last name is required.";
    if (!form.email) newErrors.email = "Email is required.";
    else if (!emailRegex.test(form.email)) newErrors.email = "Invalid email format.";
    if (!form.password) newErrors.password = "Password is required.";
    else if (form.password.length < 6) newErrors.password = "Minimum 6 characters.";
    if (!form.vehicleColor) newErrors.vehicleColor = "Select vehicle color.";
    if (!form.vehiclePlate) newErrors.vehiclePlate = "Plate number required.";
    else if (!vehiclePlateRegex.test(form.vehiclePlate)) newErrors.vehiclePlate = "Only alphanumerics allowed.";
    else if (form.vehiclePlate.length > MAX_PLATE_LENGTH) newErrors.vehiclePlate = `Max ${MAX_PLATE_LENGTH} chars.`;
    if (!form.vehicleCapacity) newErrors.vehicleCapacity = "Select capacity.";
    if (!form.vehicleType) newErrors.vehicleType = "Select vehicle type.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = {
      fullname: {
        firstname: form.firstName,
        lastname: form.lastName,
      },
      email: form.email,
      password: form.password,
      vehicle: {
        color: form.vehicleColor,
        plate: form.vehiclePlate,
        capacity: form.vehicleCapacity,
        vehicleType: form.vehicleType,
      },
    };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captains/register`,
        data
      );
      if (res.status === 201) {
        setCaptain(res.data.captain);
        localStorage.setItem("token", res.data.token);
        navigate("/captains/home");
      }
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <section className="h-[100dvh] flex flex-col justify-center items-center px-4 py-10 bg-white dark:bg-black text-black dark:text-white transition-colors duration-500 relative">
      <button
        onClick={() => navigate("/captains/login")}
        className="absolute top-5 left-5 p-2.5 rounded-xl bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm hover:bg-white/20 dark:hover:bg-gray-800/20 transition-all duration-300 hover:scale-105 hover:shadow-lg border border-gray-200/20 dark:border-gray-700/20"
        aria-label="Go back"
      >
        <i className="ri-arrow-left-line text-xl"></i>
      </button>

      <div className="absolute top-5 right-5 z-50">
        <DarkModeToggle />
      </div>

      <div className="w-full max-w-md bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 shadow-[0_15px_15px_rgba(0,0,0,0.4)] dark:shadow-[0_15px_15px_rgba(255,255,255,0.4)]">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-wide">Kuber</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Create your Captain account</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-4">
            {["firstName", "lastName"].map((field) => (
              <div key={field} className="w-1/2">
                <input
                  name={field}
                  placeholder={field === "firstName" ? "First Name" : "Last Name"}
                  value={form[field]}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-[0_10px_20px_rgba(0,0,0,0.3)] dark:shadow-[0_5px_5px_rgba(255,255,255,0.3)]"
                />
                {errors[field] && (
                  <p className="mt-1 text-sm text-red-500">{errors[field]}</p>
                )}
              </div>
            ))}
          </div>

          <div>
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-[0_10px_20px_rgba(0,0,0,0.3)] dark:shadow-[0_5px_5px_rgba(255,255,255,0.3)]"
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>

          <div>
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-[0_10px_20px_rgba(0,0,0,0.3)] dark:shadow-[0_5px_5px_rgba(255,255,255,0.3)]"
            />
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <select
                name="vehicleColor"
                value={form.vehicleColor}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-[0_10px_20px_rgba(0,0,0,0.3)] dark:shadow-[0_5px_5px_rgba(255,255,255,0.3)] appearance-none cursor-pointer"
              >
                <option value="" className="bg-white dark:bg-gray-800">Select Color</option>
                {["Red", "Blue", "Black", "White", "Gray", "Silver", "Green"].map((color) => (
                  <option key={color} value={color} className="bg-white dark:bg-gray-800">{color}</option>
                ))}
              </select>
              {errors.vehicleColor && (
                <p className="mt-1 text-sm text-red-500">{errors.vehicleColor}</p>
              )}
            </div>
            <div className="w-1/2">
              <input
                name="vehiclePlate"
                placeholder="Vehicle Plate"
                value={form.vehiclePlate}
                onChange={handleChange}
                maxLength={MAX_PLATE_LENGTH}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-[0_10px_20px_rgba(0,0,0,0.3)] dark:shadow-[0_5px_5px_rgba(255,255,255,0.3)]"
              />
              {errors.vehiclePlate && (
                <p className="mt-1 text-sm text-red-500">{errors.vehiclePlate}</p>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <select
                name="vehicleCapacity"
                value={form.vehicleCapacity}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-[0_10px_20px_rgba(0,0,0,0.3)] dark:shadow-[0_5px_5px_rgba(255,255,255,0.3)] appearance-none cursor-pointer"
              >
                <option value="" className="bg-white dark:bg-gray-800">Select Capacity</option>
                {[2, 3, 4, 5, 6].map((cap) => (
                  <option key={cap} value={cap} className="bg-white dark:bg-gray-800">{cap} Seats</option>
                ))}
              </select>
              {errors.vehicleCapacity && (
                <p className="mt-1 text-sm text-red-500">{errors.vehicleCapacity}</p>
              )}
            </div>
            <div className="w-1/2">
              <select
                name="vehicleType"
                value={form.vehicleType}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-[0_10px_20px_rgba(0,0,0,0.3)] dark:shadow-[0_5px_5px_rgba(255,255,255,0.3)] appearance-none cursor-pointer"
              >
                <option value="" className="bg-white dark:bg-gray-800">Select Type</option>
                {["KUberAuto", "KUberGo", "Premier", "MOTO"].map((type) => (
                  <option key={type} value={type} className="bg-white dark:bg-gray-800">{type}</option>
                ))}
              </select>
              {errors.vehicleType && (
                <p className="mt-1 text-sm text-red-500">{errors.vehicleType}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 font-bold rounded-lg transition duration-300 bg-blue-600 hover:bg-blue-700 text-white shadow-[0_5px_20px_rgba(0,0,0,0.3)] dark:shadow-[0_5px_20px_rgba(255,255,255,0.3)]"
          >
            Create Captain Account
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link to="/captains/login" className="text-blue-500 font-semibold hover:underline">
            Log In
          </Link>
        </p>
      </div>

      <p className="text-xs text-center mt-8 max-w-sm text-gray-500 dark:text-gray-400">
        By proceeding, you consent to receive calls, WhatsApp, or SMS messages,
        including via automated means, from Kuber and its affiliates to the
        number provided.
      </p>
    </section>
  );
};

export default CaptainSignUp;
