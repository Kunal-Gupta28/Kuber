const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const captainSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: [3, "Name must be at least 3 characters long"],
    },
    lastname: {
        type: String,
        minlength: [3, "Surname must be at least 3 characters long"],
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true, 
    minlength: [13, "Email should contain at least 13 characters"],
    match: [/\S+@\S+\.\S+/, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  socketId: {
    type: String,
  },
  status:{
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  vehicle:{
    color:{
      type: String,
      required: true,
      minlength: [3, "Color must be at least 3 characters long"],
    },
    plate:{
      type: String,
      required: true,
      minlength: [3, "Plate must be at least 3 characters long"],
    },
    capacity:{
      type: Number,
      required: true,
      min: [1, "Capacity must be at least 1"],
    },
    vehicleType:{
      type: String,
      required: true,
      enum: ["KUberAuto", "KUberGo", "Premier", "MOTO"],
  }
},
  location:{
    ltd: {
      type: Number,
    },
    lng: {
      type: Number,
    },
}
});

captainSchema.methods.generateAuthToken = function () {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables.");
  }

  const token = jwt.sign(
    { _id: this._id.toString() },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return token;
};

captainSchema.methods.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

captainSchema.statics.hashedPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

const captain = mongoose.model("Captain", captainSchema);

module.exports = captain;
