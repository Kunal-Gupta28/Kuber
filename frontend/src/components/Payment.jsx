import { useEffect } from "react";
import axios from "axios";
import { useRideContext } from "../context/RideContext";
import { useUserContext } from "../context/UserContext";


const Payment = () => {
    
    const {fare} = useRideContext();
    const {user} = useUserContext();
    const {fullname,email} = user;
    console.log(fullname,  email)
  useEffect(() => {
    const loadScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    loadScript();
  }, []);

  const handlePayment = async () => {
    try {
        const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/payment/create-order`, { amount:fare });
      const { id: order_id, currency } = res.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_API_KEY,
        amount:fare,
        currency,
        order_id,
        name: "Kuber",
        description: "Ride Payment",
        image: "/logo.png",
        handler: function (response) {
            console.log(response)
          console("Payment successful!");
        },
        prefill: {
          name: fullname.firstname + ' ' + fullname.lastname,
          email: email,
          contact: "9876543210",
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment failed:", err);
      console("Payment failed.");
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="mb-6 w-48 p-3 bg-black hover:bg-gray-800 text-white rounded-xl font-bold text-lg"
    >
      Proceed to Pay
    </button>
  );
};

export default Payment;
