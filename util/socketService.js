let ioInstance = null;

function initSocket(server) {
  const { Server } = require("socket.io");
  ioInstance = new Server(server, { cors: { origin: "*" } });

  ioInstance.on("connection", socket => {
    console.log("Client connected:", socket.id);
  });

  return ioInstance;
}

function getIO() {
  if (!ioInstance) {
    throw new Error("Socket.io not initialized!");
  }
  return ioInstance;
}

module.exports = { initSocket, getIO };
