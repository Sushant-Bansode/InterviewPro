const socketIo = require("socket.io");
module.exports = function (server) {
  const io = socketIo(server);
  io.on("connection", function (socket) {
    socket.on("chatMessage", function (data) {
      io.emit("chatMessage", data);
    });
  });
};
