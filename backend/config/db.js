const mongoose = require("mongoose");

async function connectedToDB() {
  try {
    if(!process.env.MONGODB_URI){
        throw new Error("MONGODB_URI is not defined in Enviroment variable ")
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ database is connected sucessfully.....");
  } catch (error) {
    console.error("❌ database connection error:",error.message);
    process.exit(1);
  }
}

module.exports = connectedToDB;
     