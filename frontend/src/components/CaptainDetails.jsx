import React from "react";

const CaptainDetails = ({ captain }) => {
  const profileImage = captain?.profilePicture || "/default-avatar.png";
  const firstName = captain?.fullname?.firstname || "Captain";
  const lastName = captain?.fullname?.lastname || "";
  const earnings = 254.2;
  const stats = {
    onlineHours: 10.2,
    completedRides: 42,
    rating: 4.8,
  };

  return (
    <div className="h-[30%] py-3 px-6">
      {/* Top Section: Profile & Earnings */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="h-20 w-20 rounded-full overflow-hidden bg-red-200">
            <img
              src={profileImage}
              alt="Captain"
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-2xl font-bold ms-4">
            {firstName} {lastName}
          </h3>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold">₹{earnings.toFixed(2)}</h2>
          <p className="text-gray-500">Earned</p>
        </div>
      </div>

      {/* Bottom Section: Stats */}
      <div className="bg-gray-100 px-6 py-3 rounded-xl flex justify-between text-center">
        <StatItem icon="ri-time-line" label="Hours Online" value={stats.onlineHours} />
        <StatItem icon="ri-steering-2-line" label="Rides Completed" value={stats.completedRides} />
        <StatItem icon="ri-star-line" label="Rating" value={stats.rating} />
      </div>
    </div>
  );
};

// Reusable stat display
const StatItem = ({ icon, value, label }) => (
  <div>
    <i className={`${icon} text-3xl`}></i>
    <h3 className="mt-2 text-xl font-semibold">{value}</h3>
    <h3 className="text-gray-700">{label}</h3>
  </div>
);

export default CaptainDetails;
