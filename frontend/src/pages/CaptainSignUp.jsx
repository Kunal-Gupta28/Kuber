import { useContext } from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { CaptainDataContext } from "../context/CaptainContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CaptainSignUp = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [captainData, setCaptainData] = useState({});
  const [vehicleColor, setVehicleColor] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleCapaity, setVehicleCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  const [captain, SetCaptain] = React.useContext(CaptainDataContext);

  // formhandler
  const formHandler = async (e) => {
    e.preventDefault();
    const captainData = {
      firstName: firstName,
      surname: surname,
      email: email,
      captainData: captainData,
      vehicleColor: vehicleColor,
      vehiclePlate: vehiclePlate,
      vehicleCapaity: vehicleCapaity,
      vehicleType: vehicleType,
    };
    console.log(captainData);
    const respone = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/captains/register`,
      captainData
    );
    if (respone.status == 201) {
      const data = respone.data;
      SetCaptain(data.captain);
      localStorage.setItem("token", data.token);
      navigate("captains/home");
    }
  };

  // two way binding
  const handleName = (e) => {
    setFirstName(e.target.value);
  };
  const handleSurname = (e) => {
    setSurname(e.target.value);
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleVehicleColor = (e) => {
    setVehicleColor(e.target.value);
  };
  const handleVehiclePlate = (e) => {
    setVehiclePlate(e.target.value);
  };
  const handleVehicleCapacity = (e) => {
    setVehicleCapacity(e.target.value);
  };
  const handleVehicleType = (e) => {
    setVehicleType(e.target.value);
  };

  return (
    <section className="p-5 flex flex-col justify-center">
      <header>
        <h1 className="font-bold text-2xl">Kuber</h1>
      </header>

      {/* form */}
      <form action="" onSubmit={formHandler} className="w-full max-w-sm mt-8">
        <fieldset className=" p-4">
          {/* name and surname input part */}
          <div className="mb-4 ">
            <label className="block text-xl font-medium mb-2" htmlFor="email">
              What&apos;s your name
            </label>

            <input
              className="bg-gray-200 p-3 w-[48%] me-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              id="firstname"
              name="firstname"
              type="text"
              value={firstName}
              onChange={handleName}
              required
              placeholder="Name"
            />
            <input
              className="bg-gray-200 p-3 w-[48%] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              id="surname"
              name="surname"
              type="surname"
              value={surname}
              onChange={handleSurname}
              placeholder="surname"
            />
          </div>

          {/* email input part  */}
          <div className="mb-4">
            <label className="block text-xl font-medium mb-2" htmlFor="email">
              Enter email
            </label>

            <input
              className="bg-gray-200 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={handleEmail}
              required
              placeholder="email@gmail.com"
            />
          </div>
          {/* password input part */}
          <div className="my-6">
            <label
              className="block text-xl font-medium mb-2"
              htmlFor="password"
            >
              Enter password
            </label>
            <input
              className="bg-gray-200 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={handlePassword}
              required
              placeholder="password"
            />
          </div>

          {/* vehicle details */}
          <div>
            <label className="text-xl font-semibold ">
              vehicle information
            </label>
            <div className="my-3 flex justify-between">
              <input
                type="text"
                name="VehicleColor"
                className="bg-gray-200 p-3 w-[48%] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="vehicle Color"
                onChange={handleVehicleColor}
                value={vehicleColor}
              />
              <input
                type="text"
                name="VehiclePlate"
                className="bg-gray-200 p-3 w-[48%] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="vehicle Plate"
                onChange={handleVehiclePlate}
                value={vehiclePlate}
              />
            </div>
            <div className="my-3 flex justify-between">
              <input
                name="VehicleCapacity"
                type="text"
                className="bg-gray-200 p-3 w-[48%] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="vehicle Capacity"
                onChange={handleVehicleCapacity}
                value={vehicleCapaity}
              />
              <select
                name="vehicleType"
                id="vehicleType"
                onChange={handleVehicleType}
                className="bg-gray-200 w-[48%] px-5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option className="text-center" disabled selected>
                  Select Vehicle
                </option>
                <option className="text-center" value="auto">
                  Auto
                </option>
                <option className="text-center" value="car">
                  Car
                </option>
                <option className="text-center" value="primer">
                  Primer
                </option>
                <option className="text-center" value="moto">
                  Moto
                </option>
              </select>
            </div>
          </div>

          {/* create captain account button  */}
          <button
            className="w-full py-2 mt-5 bg-black text-white text-xl font-bold rounded-md"
            type="submit"
          >
            Create Captain account
          </button>

          {/* already have an account  */}
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

      {/* copyright section */}
      <p className="mt-[30%]  text-xs">
        By producing, you consent to get calls, WHATAPP or SMS messages,
        indicating by automated means, from Kuber and its affiliates to the
        number provided.
      </p>
    </section>
  );
};

export default CaptainSignUp;
