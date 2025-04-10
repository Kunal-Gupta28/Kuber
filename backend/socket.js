const socket = require("socket.io");
const userModel = require("./models/user.model");
const captainModel = require("./models/captain.model");

let io;
function initializingSocket(server) {
  io = socket(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", async (socket) => {
    socket.on("join", async (data) => {
      const { userId, userType } = data;

      if (userType === "user") {
        await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
      } else if (userType === "captain") {
        await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
      }
    });

    socket.on("update-location-captain", async (data) => {
      const { userId, ltd, lng } = data;

      if (!userId || !ltd || !lng) {
        return socket.emit("error", { message: "Invalid location data" });
      }

      await captainModel.findByIdAndUpdate(userId, {
        location: {
          ltd: ltd,
          lng: lng,
        },
      });
    });

    socket.on("disconnect", async () => {
      await userModel.updateMany({ socketId: socket.id }, { socketId: null });
      await captainModel.updateMany({ socketId: socket.id }, { socketId: null });
    });
  });
}

function sendMessageToSocketId(socketId, messageObject) {
  if (io) {
    io.to(socketId).emit(messageObject.event, messageObject.data);
  } else {
    console.log("socket.io is not initialized");
  }
}

module.exports = { initializingSocket, sendMessageToSocketId };
