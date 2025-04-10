import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {CaptainDataContext} from '../context/CaptainContext'

const CaptainSignUp = () => {
  const navigate = useNavigate();

  // State variables for handling input values
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [vehicleColor, setVehicleColor] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const {setCaptain} = useContext(CaptainDataContext);

  // Error state variables
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    vehicleColor: "",
    vehiclePlate: "",
    vehicleCapacity: "",
    vehicleType: "",
  });

  // Regular expression for alphanumeric vehicle plate validation
  const vehiclePlateRegex = /^[A-Za-z0-9]+$/;
  const MAX_PLATE_LENGTH = 8; // Adjust this to the max length of vehicle plate numbers

  // Form validation function
  const validateForm = () => {
    const newErrors = {};

    // Validate first and last name
    if (!firstName) {
      newErrors.firstName = "First name is required.";
    }
    if (!lastName) {
      newErrors.lastName = "Last name is required.";
    }

    // Validate email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Validate password (minimum 6 characters)
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }

    // Validate vehicle color
    if (!vehicleColor) {
      newErrors.vehicleColor = "Vehicle color is required.";
    }

    // Validate vehicle plate
    if (!vehiclePlate) {
      newErrors.vehiclePlate = "Vehicle plate is required.";
    } else if (!vehiclePlateRegex.test(vehiclePlate)) {
      newErrors.vehiclePlate =
        "Vehicle plate can only contain letters and numbers.";
    } else if (vehiclePlate.length > MAX_PLATE_LENGTH) {
      newErrors.vehiclePlate = `Vehicle plate cannot exceed ${MAX_PLATE_LENGTH} characters.`;
    }

    // Validate vehicle capacity
    if (!vehicleCapacity) {
      newErrors.vehicleCapacity = "Vehicle capacity is required.";
    }

    // Validate vehicle type
    if (!vehicleType) {
      newErrors.vehicleType = "Vehicle type is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Form submission handler
  const formHandler = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Don't submit if there are validation errors
    }

    // Create data to send to the backend
    const captainData = {
      fullname: { firstname: firstName, lastname: lastName },
      email,
      password,
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: vehicleCapacity,
        vehicleType,
      },
    };
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captains/register`,
        captainData
      );
      
      if (response.status === 201) {
        setCaptain(response.data.captain)
        localStorage.setItem("token", response.data.token);
        navigate("/captains/home");
      }
    } catch (error) {
      console.error("Error registering captain:", error);
    }
  };

  return (
    <section className="p-5 flex flex-col justify-center">
      <header>
        <h1 className="font-bold text-2xl">Kuber</h1>
      </header>

      <form onSubmit={formHandler} className="w-full max-w-sm mt-8">
        <fieldset className="p-4">
          <div className="mb-4">
            <label className="block text-xl font-medium mb-2">
              What&apos;s your name
            </label>
            <input
              className={`bg-gray-200 p-3 w-[48%] me-3 rounded-md ${
                errors.firstName ? "border-2 border-red-500" : ""
              }`}
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              placeholder="First Name"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm flex items-center">
                <span className="mr-1 text-lg">!</span>
                {errors.firstName}
              </p>
            )}

            <input
              className={`bg-gray-200 p-3 w-[48%] rounded-md ${
                errors.lastName ? "border-2 border-red-500" : ""
              }`}
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm flex items-center">
                <span className="mr-1 text-lg">!</span>
                {errors.lastName}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-xl font-medium mb-2">
              Enter email
            </label>
            <input
              className={`bg-gray-200 p-3 w-full rounded-md ${
                errors.email ? "border-2 border-red-500" : ""
              }`}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="email@gmail.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm flex items-center">
                <span className="mr-1 text-lg">!</span>
                {errors.email}
              </p>
            )}
          </div>

          <div className="my-6">
            <label className="block text-xl font-medium mb-2">
              Enter password
            </label>
            <input
              className={`bg-gray-200 p-3 w-full rounded-md ${
                errors.password ? "border-2 border-red-500" : ""
              }`}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm flex items-center">
                <span className="mr-1 text-lg">!</span>
                {errors.password}
              </p>
            )}
          </div>

          <div>
            <label className="text-xl font-semibold">Vehicle Information</label>
            <div className="my-3 flex justify-between">
              <select
                name="vehicleColor"
                value={vehicleColor}
                onChange={(e) => setVehicleColor(e.target.value)}
                className={`bg-gray-200 p-3 w-[48%] rounded-md ${
                  errors.vehicleColor ? "border-2 border-red-500" : ""
                }`}
              >
                <option value="" disabled>
                  Select Color
                </option>
                <option value="Red">Red</option>
                <option value="Blue">Blue</option>
                <option value="Black">Black</option>
                <option value="White">White</option>
                <option value="Green">Green</option>
                <option value="Yellow">Yellow</option>
                <option value="Silver">Silver</option>
                <option value="Gray">Gray</option>
              </select>
              {errors.vehicleColor && (
                <p className="text-red-500 text-sm flex items-center">
                  <span className="mr-1 text-lg">!</span>
                  {errors.vehicleColor}
                </p>
              )}

              <input
                type="text"
                className={`bg-gray-200 p-3 w-[48%] rounded-md ${
                  errors.vehiclePlate ? "border-2 border-red-500" : ""
                }`}
                placeholder="Vehicle Plate"
                onChange={(e) => setVehiclePlate(e.target.value)}
                value={vehiclePlate}
                maxLength={MAX_PLATE_LENGTH} // Limit input length to the max plate length
              />
              {errors.vehiclePlate && (
                <p className="text-red-500 text-sm flex items-center">
                  <span className="mr-1 text-lg">!</span>
                  {errors.vehiclePlate}
                </p>
              )}
            </div>

            <div className="my-3 flex justify-between">
              <select
                name="vehicleCapacity"
                value={vehicleCapacity}
                onChange={(e) => setVehicleCapacity(e.target.value)}
                className={`bg-gray-200 p-3 w-[48%] rounded-md ${
                  errors.vehicleCapacity ? "border-2 border-red-500" : ""
                }`}
              >
                <option value="" disabled>
                  Select Capacity
                </option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
              </select>
              {errors.vehicleCapacity && (
                <p className="text-red-500 text-sm flex items-center">
                  <span className="mr-1 text-lg">!</span>
                  {errors.vehicleCapacity}
                </p>
              )}

              <select
                name="vehicleType"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className={`bg-gray-200 w-[48%] px-5 rounded-md ${
                  errors.vehicleType ? "border-2 border-red-500" : ""
                }`}
              >
                <option value="" disabled>
                  Select Vehicle Type
                </option>{" "}
                {/* This option should be the first one, allowing the user to choose */}
                <option value="KUberAuto">KUberAuto</option>
                <option value="KUberGo">KUberGo</option>
                <option value="Premier">Premier</option>
                <option value="MOTO">MOTO</option>
              </select>
              {errors.vehicleType && (
                <p className="text-red-500 text-sm flex items-center">
                  <span className="mr-1 text-lg">!</span>
                  {errors.vehicleType}
                </p>
              )}
            </div>
          </div>

          <button
            className="w-full py-2 mt-5 bg-black text-white text-xl font-bold rounded-md"
            type="submit"
          >
            Create Captain Account
          </button>
        </fieldset>
      </form>

      <div className="text-center">
        <p>
          Already have an account?
          <Link to="/captains/login" className="text-blue-500 font-bold">
            {" "}
            Login here
          </Link>
        </p>
      </div>

      <p className="mt-[30%] text-xs">
        By proceeding, you consent to receive calls, WhatsApp, or SMS messages,
        including automated ones, from Kuber and its affiliates to the provided
        number.
      </p>
    </section>
  );
};

export default CaptainSignUp;
