import { useCaptainContext } from "../context/CaptainContext";
import RideDetails from "./RideDetails";
import { motion } from "framer-motion";

const RidePopUpPanel = ({
  setRidePopUpPanel,
  setConfirmRidePopUpPanel,
  confirmRide,
}) => {
  const { ride } = useCaptainContext();

  if (!ride) return null;

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 120 }}
      className="w-full bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-t-3xl shadow-xl text-black dark:text-white"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
          New Ride Request
        </h2>
        <button
          onClick={() => setRidePopUpPanel(false)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <i className="ri-close-line text-2xl"></i>
        </button>
      </div>

      {/* User Info */}
      <div className="mb-6">
        <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700">
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden">
              <img
                src={ride?.user?.profilePicture || "/default-avatar.png"}
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">
              {ride?.user?.fullname?.firstname} {ride?.user?.fullname?.lastname}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">2.2km away</p>
          </div>
        </div>
      </div>

      {/* Ride Details */}
      <div className="mb-6">
        <RideDetails userType="captain" ride={ride} />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => {
            setConfirmRidePopUpPanel(true);
            confirmRide();
          }}
          className="flex-1 py-3 px-6 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 rounded-xl text-white font-semibold text-lg transition-colors flex items-center justify-center gap-2"
        >
          <i className="ri-check-line"></i>
          Accept Ride
        </button>
        <button
          onClick={() => setRidePopUpPanel(false)}
          className="flex-1 py-3 px-6 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-xl text-gray-800 dark:text-white font-semibold text-lg transition-colors flex items-center justify-center gap-2"
        >
          <i className="ri-close-line"></i>
          Decline
        </button>
      </div>
    </motion.div>
  );
};

export default RidePopUpPanel;
