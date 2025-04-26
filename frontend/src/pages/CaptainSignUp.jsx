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
    <section className="h-[100dvh] bg-white dark:bg-black text-black dark:text-white p-5 flex flex-col items-center justify-center">
      <DarkModeToggle />
      <div className="w-full max-w-md bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Kuber Captain Sign Up</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            {["firstName", "lastName"].map((field) => (
              <div key={field} className="w-1/2">
                <input
                  name={field}
                  placeholder={field === "firstName" ? "First Name" : "Last Name"}
                  value={form[field]}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-200 dark:bg-gray-700 rounded-md focus:ring-2 focus:outline-none focus:ring-blue-400"
                />
                {errors[field] && (
                  <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
                )}
              </div>
            ))}
          </div>

          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 bg-gray-200 dark:bg-gray-700 rounded-md focus:ring-2 focus:outline-none focus:ring-blue-400"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 bg-gray-200 dark:bg-gray-700 rounded-md focus:ring-2 focus:outline-none focus:ring-blue-400"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}

          <div className="flex gap-4">
            <div className="w-1/2">
              <select
                name="vehicleColor"
                value={form.vehicleColor}
                onChange={handleChange}
                className="w-full p-3 bg-gray-200 dark:bg-gray-700 rounded-md"
              >
                <option value="">Select Color</option>
                {["Red", "Blue", "Black", "White", "Gray", "Silver", "Green"].map((color) => (
                  <option key={color}>{color}</option>
                ))}
              </select>
              {errors.vehicleColor && (
                <p className="text-red-500 text-sm mt-1">{errors.vehicleColor}</p>
              )}
            </div>
            <div className="w-1/2">
              <input
                name="vehiclePlate"
                placeholder="Vehicle Plate"
                value={form.vehiclePlate}
                onChange={handleChange}
                maxLength={MAX_PLATE_LENGTH}
                className="w-full p-3 bg-gray-200 dark:bg-gray-700 rounded-md"
              />
              {errors.vehiclePlate && (
                <p className="text-red-500 text-sm mt-1">{errors.vehiclePlate}</p>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <select
                name="vehicleCapacity"
                value={form.vehicleCapacity}
                onChange={handleChange}
                className="w-full p-3 bg-gray-200 dark:bg-gray-700 rounded-md"
              >
                <option value="">Select Capacity</option>
                {[2, 3, 4, 5, 6].map((cap) => (
                  <option key={cap}>{cap}</option>
                ))}
              </select>
              {errors.vehicleCapacity && (
                <p className="text-red-500 text-sm mt-1">{errors.vehicleCapacity}</p>
              )}
            </div>
            <div className="w-1/2">
              <select
                name="vehicleType"
                value={form.vehicleType}
                onChange={handleChange}
                className="w-full p-3 bg-gray-200 dark:bg-gray-700 rounded-md"
              >
                <option value="">Select Type</option>
                {["KUberAuto", "KUberGo", "Premier", "MOTO"].map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
              {errors.vehicleType && (
                <p className="text-red-500 text-sm mt-1">{errors.vehicleType}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-black dark:bg-white text-white dark:text-black text-lg font-bold rounded-md hover:opacity-90 transition-all"
          >
            Create Captain Account
          </button>
        </form>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link to="/captains/login" className="text-blue-500 font-medium">
            Login here
          </Link>
        </p>

        <p className="text-xs text-center mt-6 text-gray-600 dark:text-gray-400">
          By proceeding, you consent to receive calls, WhatsApp, or SMS messages
          from Kuber and its affiliates.
        </p>
      </div>
    </section>
  );
};

export default CaptainSignUp;
