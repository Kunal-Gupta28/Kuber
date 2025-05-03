import { useState, useEffect } from "react";
import { useCaptainContext } from "../context/CaptainContext";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "./Loader";

const CaptainProfile = () => {
  // Context and navigation hooks
  const { captain, setCaptain } = useCaptainContext();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [formData, setFormData] = useState({
    firstname: captain?.fullname?.firstname || "",
    lastname: captain?.fullname?.lastname || "",
    email: captain?.email || "",
    phone: captain?.phone || "+91 9876543210",
    image: captain?.image || "",
    vehicleNumber: captain?.vehicleNumber || "",
    vehicleModel: captain?.vehicleModel || "",
    licenseNumber: captain?.licenseNumber || "",
  });


  // Dark mode effect handler
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Form handlers
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Image upload handler
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captains/upload-profile-image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Update captain context with new profile picture
      setCaptain(prev => ({
        ...prev,
        image: response.data.image
      }));

      // Update form data
      setFormData(prev => ({
        ...prev,
        image: response.data.image
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Profile update handler
  const handleSubmit = async (field) => {
    setIsLoading(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/captains/update-profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCaptain(response.data);
      setEditingField(null);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="h-[100dvh] w-full flex justify-center items-center">
        <Loader message="Updating profile..." />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
          {/* Header Section with Gradient Background */}
          <div className="relative h-48 sm:h-56 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 dark:from-blue-600 dark:via-blue-700 dark:to-blue-800">
            {/* Navigation Button */}
            <button
              onClick={() => navigate("/captains/home")}
              className="absolute top-4 left-4 p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all duration-200 backdrop-blur-sm hover:scale-105 hover:shadow-lg"
              aria-label="Go to home"
            >
              <i className="ri-home-line text-xl"></i>
            </button>

            {/* Profile Picture Section */}
            <div className="absolute -bottom-16 sm:-bottom-20 left-4 sm:left-8">
              <div className="relative group">
                {/* Profile Image Container */}
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-800 overflow-hidden shadow-xl ring-4 ring-blue-500/20 dark:ring-blue-400/20 transform transition-transform duration-300 group-hover:scale-105">
                  {captain?.image ? (
                    <img
                      src={captain.image}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                      <i className="ri-user-line text-6xl sm:text-7xl text-gray-400"></i>
                    </div>
                  )}
                </div>
                {/* Edit Profile Picture Button */}
                <button
                  onClick={() => document.getElementById('profileImageUpload').click()}
                  className="absolute -bottom-1 -right-1 w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition-all duration-200 border-2 border-white dark:border-gray-800 hover:scale-110 hover:shadow-xl"
                  aria-label="Edit profile picture"
                >
                  <i className="ri-pencil-line text-base"></i>
                </button>
                {/* Hidden File Input */}
                <input
                  type="file"
                  id="profileImageUpload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="absolute top-4 right-4 p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all duration-200 backdrop-blur-sm hover:scale-105 hover:shadow-lg"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <i className="ri-sun-line text-xl"></i>
              ) : (
                <i className="ri-moon-line text-xl"></i>
              )}
            </button>
          </div>

          {/* Content Section */}
          <div className="pt-24 sm:pt-28 pb-6 sm:pb-8 px-4 sm:px-8">
            {/* Captain Name and Email */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  {captain?.fullname?.firstname} {captain?.fullname?.lastname}
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 flex items-center">
                  <i className="ri-mail-line mr-2"></i>
                  {captain?.email}
                </p>
              </div>
            </div>

            {/* Profile Information Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Personal Information Section */}
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 sm:p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <i className="ri-user-settings-line mr-2 text-blue-500"></i>
                    Personal Information
                  </h3>
                  {/* Editable Fields */}
                  <div className="space-y-4">
                    {/* Name Field */}
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                        {editingField === 'name' ? (
                          <div className="flex gap-2 mt-1">
                            <input
                              type="text"
                              name="firstname"
                              value={formData.firstname}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm transition-all duration-200"
                              placeholder="First Name"
                            />
                            <input
                              type="text"
                              name="lastname"
                              value={formData.lastname}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm transition-all duration-200"
                              placeholder="Last Name"
                            />
                          </div>
                        ) : (
                          <p className="text-gray-900 dark:text-white font-medium">
                            {captain?.fullname?.firstname} {captain?.fullname?.lastname}
                          </p>
                        )}
                      </div>
                      {/* Edit Buttons */}
                      {editingField === 'name' ? (
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleSubmit('name')}
                            className="p-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-all duration-200 hover:scale-110"
                          >
                            <i className="ri-check-line text-xl"></i>
                          </button>
                          <button
                            onClick={() => setEditingField(null)}
                            className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-all duration-200 hover:scale-110"
                          >
                            <i className="ri-close-line text-xl"></i>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingField('name')}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-all duration-200 hover:scale-110"
                        >
                          <i className="ri-pencil-line text-lg"></i>
                        </button>
                      )}
                    </div>

                    {/* Email Field */}
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                        <p className="text-gray-900 dark:text-white font-medium">{captain?.email}</p>
                      </div>
                    </div>

                    {/* Phone Field */}
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                        {editingField === 'phone' ? (
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm transition-all duration-200"
                          />
                        ) : (
                          <p className="text-gray-900 dark:text-white font-medium">{formData.phone}</p>
                        )}
                      </div>
                      {/* Edit Buttons */}
                      {editingField === 'phone' ? (
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleSubmit('phone')}
                            className="p-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-all duration-200 hover:scale-110"
                          >
                            <i className="ri-check-line text-xl"></i>
                          </button>
                          <button
                            onClick={() => setEditingField(null)}
                            className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-all duration-200 hover:scale-110"
                          >
                            <i className="ri-close-line text-xl"></i>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingField('phone')}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-all duration-200 hover:scale-110"
                        >
                          <i className="ri-pencil-line text-lg"></i>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Vehicle Information Section */}
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 sm:p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <i className="ri-car-line mr-2 text-blue-500"></i>
                    Vehicle Information
                  </h3>
                  {/* Editable Fields */}
                  <div className="space-y-4">
                    {/* Vehicle Number Field */}
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Vehicle Number</p>
                        {editingField === 'vehicleNumber' ? (
                          <input
                            type="text"
                            name="vehicleNumber"
                            value={formData.vehicleNumber}
                            onChange={handleChange}
                            className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm transition-all duration-200"
                          />
                        ) : (
                          <p className="text-gray-900 dark:text-white font-medium">{captain?.vehicleNumber}</p>
                        )}
                      </div>
                      {/* Edit Buttons */}
                      {editingField === 'vehicleNumber' ? (
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleSubmit('vehicleNumber')}
                            className="p-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-all duration-200 hover:scale-110"
                          >
                            <i className="ri-check-line text-xl"></i>
                          </button>
                          <button
                            onClick={() => setEditingField(null)}
                            className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-all duration-200 hover:scale-110"
                          >
                            <i className="ri-close-line text-xl"></i>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingField('vehicleNumber')}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-all duration-200 hover:scale-110"
                        >
                          <i className="ri-pencil-line text-lg"></i>
                        </button>
                      )}
                    </div>

                    {/* Vehicle Model Field */}
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Vehicle Model</p>
                        {editingField === 'vehicleModel' ? (
                          <input
                            type="text"
                            name="vehicleModel"
                            value={formData.vehicleModel}
                            onChange={handleChange}
                            className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm transition-all duration-200"
                          />
                        ) : (
                          <p className="text-gray-900 dark:text-white font-medium">{captain?.vehicleModel}</p>
                        )}
                      </div>
                      {/* Edit Buttons */}
                      {editingField === 'vehicleModel' ? (
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleSubmit('vehicleModel')}
                            className="p-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-all duration-200 hover:scale-110"
                          >
                            <i className="ri-check-line text-xl"></i>
                          </button>
                          <button
                            onClick={() => setEditingField(null)}
                            className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-all duration-200 hover:scale-110"
                          >
                            <i className="ri-close-line text-xl"></i>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingField('vehicleModel')}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-all duration-200 hover:scale-110"
                        >
                          <i className="ri-pencil-line text-lg"></i>
                        </button>
                      )}
                    </div>

                    {/* License Number Field */}
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 dark:text-gray-400">License Number</p>
                        {editingField === 'licenseNumber' ? (
                          <input
                            type="text"
                            name="licenseNumber"
                            value={formData.licenseNumber}
                            onChange={handleChange}
                            className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm transition-all duration-200"
                          />
                        ) : (
                          <p className="text-gray-900 dark:text-white font-medium">{captain?.licenseNumber}</p>
                        )}
                      </div>
                      {/* Edit Buttons */}
                      {editingField === 'licenseNumber' ? (
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleSubmit('licenseNumber')}
                            className="p-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-all duration-200 hover:scale-110"
                          >
                            <i className="ri-check-line text-xl"></i>
                          </button>
                          <button
                            onClick={() => setEditingField(null)}
                            className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-all duration-200 hover:scale-110"
                          >
                            <i className="ri-close-line text-xl"></i>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingField('licenseNumber')}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-all duration-200 hover:scale-110"
                        >
                          <i className="ri-pencil-line text-lg"></i>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Information Section */}
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 sm:p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <i className="ri-user-settings-line mr-2 text-blue-500"></i>
                    Account Information
                  </h3>
                  <div className="space-y-4">
                    {/* Total Trips */}
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total Trips</p>
                      <p className="text-gray-900 dark:text-white font-medium flex items-center">
                        <i className="ri-route-line mr-2 text-blue-500"></i>
                        {captain?.totalTrips || 0} trips completed
                      </p>
                    </div>
                    {/* Average Rating */}
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Average Rating</p>
                      <p className="text-gray-900 dark:text-white font-medium flex items-center">
                        <i className="ri-star-line mr-2 text-blue-500"></i>
                        {captain?.averageRating || 0} / 5.0
                      </p>
                    </div>
                    {/* Earnings */}
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Earnings</p>
                      <p className="text-gray-900 dark:text-white font-medium flex items-center">
                        <i className="ri-money-dollar-circle-line mr-2 text-blue-500"></i>
                        ${captain?.totalEarnings || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaptainProfile; 