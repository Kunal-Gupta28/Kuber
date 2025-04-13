import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef } from "react";
import { SocketContext } from "../context/SocketContext";
import LiveTracking from "./LiveTracking";
import RideDetails from "./RideDetails";
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

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Socket listener for ride end
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

  const launchPayment = () => {
    const amount = ride?.fare || 100;

    const options = {
      key: "rzp_test_YourTestKeyHere",
      amount: amount * 100,
      currency: "INR",
      name: "Ride App",
      description: "Ride Payment",
      handler: function (response) {
        alert("Payment Success: " + response.razorpay_payment_id);
        navigate("/home");
      },
      prefill: {
        name: "John Doe",
        email: "john@example.com",
        contact: "9000000000",
      },
      theme: { color: "#3399cc" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <main className="h-screen w-full flex flex-col md:flex-row overflow-hidden">
      <Link to="/home">
        <span className="fixed top-2 right-5 z-50 text-3xl p-3 bg-white rounded-full shadow-md">
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
        <RideDetails />
        <div className="flex justify-evenly mt-4">
          <button
            onClick={launchPayment}
            className="mb-6 w-48 p-3 bg-black hover:bg-gray-800 text-white rounded-xl font-bold text-lg"
          >
            Proceed to Pay
          </button>
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
