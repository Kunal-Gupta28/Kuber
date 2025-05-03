const userModel = require("../models/user.model");

module.exports.createUser = async ({firstname, lastname, email, password}) => {
  if (!firstname || !lastname || !email || !password) {
    throw new Error("All fields are required");
  }

  try {
    const user = await userModel.create({
      fullname: {
        firstname:firstname,
        lastname:lastname,
      },
      email,
      password,
    });
    return user;

  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
};

module.exports.updateProfileImage = async (userId,file) => {
  if (!file || !userId) {
    throw new Error("File and userId are required");
  }
  try {
    const updatedUser = await userModel.findByIdAndUpdate(userId, { image: file.path }, { new: true, select: "-password" });
    return updatedUser;
  } catch (error) {
    throw new Error(`Error updating user profile: ${error.message}`);
  }
}