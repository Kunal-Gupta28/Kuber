import React from "react";

const CaptainDetails = ({ captain }) => {
  const firstName = captain?.fullname?.firstname || "Captain";
  const lastName = captain?.fullname?.lastname || "";
  const earnings = 254.2;
  const stats = {
    onlineHours: 10.2,
    rating: 4.8,
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg px-6 py-4 h-full">
      {/* Profile Header */}
      <div className="flex items-center space-x-4 mb-4 xl:mb-6">
        {captain?.image ? (
          <img
            src={captain.image}
            alt="Profile"
            className="w-16 h-16 object-cover rounded-full border-2 border-gray-300"
          />
        ) : (
          <div className="w-16 h-16 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full border-2 border-gray-300">
            <i className="ri-user-line text-4xl text-gray-400"></i>
          </div>
        )}
        <div>
          <h2
            className="font-semibold text-gray-900 dark:text-white"
            style={{ fontSize: "clamp(1.125rem, 3vw, 1.5rem)" }}
          >
            {firstName} {lastName}
          </h2>
          <p
            className="text-gray-600 dark:text-gray-400"
            style={{ fontSize: "clamp(0.8rem, 2.5vw, 1rem)" }}
          >
            ID: {captain?._id || "N/A"}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="h-[55%] xl:h-[60%] flex justify-between xl:justify-evenly text-center">
        <StatItem icon="ri-wallet-line" value={`₹${earnings}`} label="Earnings" />
        <StatItem icon="ri-time-line" value={`${stats.onlineHours}h`} label="Online" />
        <StatItem icon="ri-star-line" value={stats.rating} label="Rating" />
      </div>
    </div>
  );
};

const StatItem = ({ icon, value, label }) => (
  <div className="w-28 w-[30%] flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-xl py-3 shadow">
    <i
      className={`${icon} text-blue-600 dark:text-blue-300 mb-1`}
      style={{ fontSize: "clamp(1.25rem, 4vw, 2rem)" }}
    />
    <h3
      className="font-bold text-gray-900 dark:text-white"
      style={{ fontSize: "clamp(1rem, 3vw, 1.25rem)" }}
    >
      {value}
    </h3>
    <p
      className="text-gray-600 dark:text-gray-400"
      style={{ fontSize: "clamp(0.75rem, 2.5vw, 0.95rem)" }}
    >
      {label}
    </p>
  </div>
);

export default CaptainDetails;
