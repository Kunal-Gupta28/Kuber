import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef } from "react";
import { SocketContext } from "../context/SocketContext";
import LiveTracking from "./LiveTracking";
import RideDetails from "./RideDetails";
import Payment from "./Payment";
import gsap from "gsap";

const Riding = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);

  const state = location.state || {};
  const ride = state.ride || null;
  const coordinates =
    state.coordinates || JSON.parse(localStorage.getItem("coordinates"));

  const rideDetailsRef = useRef(null);

  useEffect(() => {
    const handleRideEnded = (ride) => {
      if (ride?.captain && ride?.user) {
        navigate("/home");
      }
    };

    socket?.on("ride-ended", handleRideEnded);
    return () => socket?.off("ride-ended", handleRideEnded);
  }, [socket, navigate]);

  const showRideDetails = () => {
    gsap.to(rideDetailsRef.current, {
      y: 0,
      duration: 1,
      ease: "power3.out",
    });
  };

  const hideRideDetails = () => {
    gsap.to(rideDetailsRef.current, {
      y: "100%",
      duration: 1,
      ease: "power3.in",
    });
  };

  return (
    <main className="h-screen w-full flex flex-col md:flex-row overflow-hidden">
      <Link to="/home">
        <span className="fixed top-2 right-5 z-50 text-3xl p-3 bg-white rounded-full shadow-md" title="Go Home">
          <i className="ri-home-4-line"></i>
        </span>
      </Link>

      <section className="h-4/5 overflow-hidden">
        <LiveTracking coordinates={coordinates} />
      </section>

      <div className="h-1/5 w-full bg-yellow-400 p-5 fixed bottom-0 flex justify-evenly items-center z-40">
        <h3 className="h-16 w-48 bg-green-600 rounded-xl text-xl font-semibold text-white flex justify-center items-center">
          4 Km away
        </h3>
        <button
          onClick={showRideDetails}
          className="h-16 w-48 bg-green-600 rounded-xl text-xl font-semibold text-white"
        >
          Make Payment
        </button>
      </div>

      <section
        ref={rideDetailsRef}
        className="pt-5 w-full fixed bottom-0 translate-y-full bg-white z-50 shadow-xl rounded-t-3xl"
        style={{ transform: "translateY(100%)" }}
      >
        <RideDetails ride={ride} />
        <div className="flex justify-evenly mt-4">
          <Payment amount={500} />
          <button
            onClick={hideRideDetails}
            className="mb-6 w-48 p-3 bg-black hover:bg-gray-800 text-white rounded-xl font-bold text-lg"
          >
            Back
          </button>
        </div>
      </section>
    </main>
  );
};

export default Riding;
