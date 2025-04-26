import { useEffect, useState } from "react";
import axios from "axios";
import { useRideContext } from "../context/RideContext";
import { useUserContext } from "../context/UserContext";
import { toast } from "react-hot-toast";

const Payment = () => {
  const { fare } = useRideContext();
  const { user } = useUserContext();
  const { fullname, email } = user;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
      setIsLoading(true);
      setError(null);

      // Validate fare before proceeding
      if (!fare || isNaN(fare) || fare <= 0) {
        throw new Error("Invalid fare amount");
      }

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/payment/create-order`,
        {
          amount: Math.round(fare * 100),
          currency: "INR",
          receipt: `receipt_${Date.now()}`,
          notes: {
            rideId: localStorage.getItem("currentRideId"),
            userId: user._id,
          },
        }
      );

      const { id, currency } = res.data.data;
      const options = {
        key: import.meta.env.VITE_RAZORPAY_API_KEY,
        amount: Math.round(fare * 100),
        currency,
        order_id: id, 
        name: "Kuber",
        description: "Ride Payment",
        image: "/logo.png",
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${import.meta.env.VITE_BASE_URL}/payment/verify`,
              {
                orderId: id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature
              }
            );
            
      
            if (verifyRes.data.success) {
              toast.success("Payment successful!");
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (err) {
            console.error("Payment verification failed:", err);
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: `${fullname.firstname} ${fullname.lastname}`,
          email: email,
          contact: user.phone || "9876543210",
        },
        theme: { color: "#3399cc" },
        modal: {
          ondismiss: function() {
            toast.error("Payment cancelled");
          }
        }
      };
      

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment failed:", err);
      setError(err.response?.data?.errors || err.message);
      toast.error(err.response?.data?.errors?.[0]?.msg || "Payment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={handlePayment}
        disabled={isLoading}
        className={`w-48 p-3 rounded-xl font-bold text-lg transition-colors ${
          isLoading
            ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
            : "bg-black dark:bg-gray-900 hover:bg-gray-800 dark:hover:bg-gray-700 text-white"
        }`}
      >
        {isLoading ? "Processing..." : "Proceed to Pay"}
      </button>
      
      {error && (
        <div className="text-red-500 text-sm mt-2">
          {Array.isArray(error) ? error[0].msg : error}
        </div>
      )}
    </div>
  );
};

export default Payment;
