const captainModel = require("../models/captain.model");

module.exports.createCaptain = async ({firstname, lastname, email, password, color, plate, capacity, vehicleType}) => {
  console.log(firstname)
  console.log(lastname)
  console.log(email)
  console.log(password)
  console.log(color)
  console.log(plate)
  console.log(capacity)
  console.log(vehicleType)

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