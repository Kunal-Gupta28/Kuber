import { useState,useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {UserDataContext} from "../context/UserContext";

const UserSignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastname, setlastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newUser, setNewUser] = useState({});

  const navigate = useNavigate();
  const {user,setUser} = useContext(UserDataContext)

  // two way binding
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

  // form handler
  const formHandler = async (e) => {
    e.preventDefault();

    // updating user data
    setNewUser({
      fullname:{
        firstname: firstName,
        lastname: lastname
      },
      email: email,
      password: password,
    });



    console.log(newUser);
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser);
    if(response.status === 201) {
      const data = response.data;
      setUser(data.user);
      localStorage.setItem('token',data.token);
      navigate('/home');
    }



    console.log("User data:", newUser);
    // clearing input fields
    setFirstName("");
    setlastname("");
    setEmail("");
    setPassword("");
  };


  return (
    <section className="p-5 flex flex-col justify-center">
      <header>
        <h1 className="font-bold text-2xl">Kuber</h1>
      </header>

      <form action="" onSubmit={formHandler} className="w-full max-w-sm mt-8">
        <fieldset className=" p-4">
          <div className="mb-4 ">
            <label className="block text-xl font-medium mb-2" htmlFor="email">
            What&apos;s your name
            </label>

            <input
              className="bg-gray-200 p-3 w-[48%] me-[4%] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
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
              id="lastname"
              name="lastname"
              type="text"
              value={lastname}
              onChange={handlelastname}
              placeholder="lastname"
            />
          </div>

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
          <button
            className="w-full py-2 mt-3 bg-black text-white text-xl font-bold rounded-md"
            type="submit"
          >
            Create account
          </button>
        </fieldset>
      </form>
      <div className="text-center">
        <p>
          Already have an account?
          <Link to="/users/login" className="text-blue-500 font-bold">
            {" "}
            Login here
          </Link>
        </p>
      </div>

      <p className="mt-[30%]  text-xs">
        By producing, you consent to get calls, WHATAPP or SMS messages,
        indicating by automated means, from Kuber and its affiliates to the
        number provided.
      </p>
    </section>
  );
};

export default UserSignUp;
