const captainModel = require("../models/captain.model");

module.exports.createCaptain = async ({firstname, lastname, email, password, color, plate, capacity, vehicleType}) => {

  if (!firstname || !lastname || !email || !password || !color || !plate || !capacity || !vehicleType) {
    throw new Error("All fields are required");
  }

  
  try {
    const captain = await captainModel.create({
      fullname: {
        firstname:firstname,
        lastname:lastname,
      },
      email,
      password,
      vehicle: {
        color,
        plate,
        capacity,
        vehicleType}
    });
    return captain;

  } catch (error) {
    throw new Error(`Error creating captain: ${error.message}`);
  }
};

module.exports.updateProfileImage = async (captainId,file) => {
  if (!file || !captainId) {
    throw new Error("File and captainId are required");
  }
  try {
    const updatedCaptainImage = await captainModel.findByIdAndUpdate(captainId, { image: file.path }, { new: true, select: "-password" });
    return updatedCaptainImage;
  } catch (error) {
    throw new Error(`Error updating captain profile: ${error.message}`);
  }
}