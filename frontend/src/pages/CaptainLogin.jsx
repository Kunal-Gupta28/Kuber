import { useState } from "react";
import { Link } from "react-router-dom";

    const CaptainLogin = ()=>{
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const [captainData, setCaptainData] = useState({}); 
      
        const handleEmail = (e) => {setEmail(e.target.value)};
        const handlePassword = (e) => {setPassword(e.target.value)};
        const formHandler = (e) =>{
          e.preventDefault();
          setCaptainData({email: email, password: password});
          setEmail("");
          setPassword("");
        }
        return(
            <section className="p-5 flex flex-col justify-center">
            <header>
              <h1 className="font-bold text-2xl">Kuber</h1>
            </header>
            <form action="" onSubmit={formHandler} className="w-full max-w-sm mt-8">
              <fieldset className=" p-4">
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
                  Login
                </button>
              </fieldset>
            </form>
            <div className="text-center">
              <p>join a fleet? 
              <Link to="/captains/register" className="text-blue-500 font-bold"> register as a Captain</Link>
              </p>
            </div>
      
            <Link to='/users/login' className="w-[92%] py-2 mt-[70%] bg-green-500 text-white text-center text-xl font-bold rounded-md mx-auto">Sign in as User</Link>
          </section>
        )
    }

export default CaptainLogin;