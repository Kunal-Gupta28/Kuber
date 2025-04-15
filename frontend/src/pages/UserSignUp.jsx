import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";

const UserSignUp = () => {
  // State for form fields
  const [firstName, setFirstName] = useState("");
  const [lastname, setlastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserDataContext);

  // Two-way binding handlers
  const handleName = (e) => {
    setFirstName(e.target.value);
  };
  const handlelastname = (e) => {
    setlastname(e.target.value);
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  // Form submission handler
  const formHandler = async (e) => {
    e.preventDefault();

    const newUserData = {
      fullname: {
        firstname: firstName,
        lastname: lastname,
      },
      email: email,
      password: password,
    };


    // Sending request to the backend
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
      }


      // Clearing input fields
      setFirstName("");
      setlastname("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Error during registration:", error.response?.data || error);
    }
  };

  return (
    <section className="p-5 flex flex-col justify-center">
      <header>
        <h1 className="font-bold text-2xl">Kuber</h1>
      </header>

      <form action="" onSubmit={formHandler} className="w-full max-w-sm mt-8">
        <fieldset className="p-4">
          <div className="mb-4">
            <label className="block text-xl font-medium mb-2" htmlFor="email">
              What&apos;s your name
            </label>

            {/* First Name Input */}
            <input
              className="bg-gray-200 p-3 w-[48%] me-[4%] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              id="firstname"
              name="firstname"
              type="text"
              value={firstName}
              onChange={handleName}
              required
              placeholder="First name"
            />
            {/* Last Name Input */}
            <input
              className="bg-gray-200 p-3 w-[48%] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              id="lastname"
              name="lastname"
              type="text"
              value={lastname}
              onChange={handlelastname}
              placeholder="Last name"
            />
          </div>

          {/* Email Input */}
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

          {/* Password Input */}
          <div className="my-6">
            <label className="block text-xl font-medium mb-2" htmlFor="password">
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

          {/* Submit Button */}
          <button
            className="w-full py-2 mt-3 bg-black text-white text-xl font-bold rounded-md"
            type="submit"
          >
            Create account
          </button>
        </fieldset>
      </form>

      {/* Login Redirect */}
      <div className="text-center">
        <p>
          Already have an account?
          <Link to="/users/login" className="text-blue-500 font-bold">
            {" "}
            Login here
          </Link>
        </p>
      </div>

      <p className="mt-[30%] text-xs">
        By proceeding, you consent to receive calls, WhatsApp, or SMS messages,
        including via automated means, from Kuber and its affiliates to the
        number provided.
      </p>
    </section>
  );
};

export default UserSignUp;
