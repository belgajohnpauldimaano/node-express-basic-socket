const clients = [];

module.exports = {
  init: server => {
    io = require("socket.io")(server);
    console.log("Initialization");

    io.on("connection", function(socket) {
      socket.on("register", data => {
        console.log(data, "register");

        // find client via socket id
        const selectedSocketClientObj = clients.find(
          i => i.socketId === socket.id
        );
        // update client info on register
        selectedSocketClientObj.username = `${data.username}`;

        console.log(clients, "clients");

        const registeredClients = clients.filter(i => i.username !== "");

        io.emit("client-list", { clients: registeredClients });
      });

      socket.on("disconnect", () => {
        // find the index of disconnected client to be removed
        const disconnectedClientIndexInArray = clients.findIndex(
          i => i.socketId === socket.id
        );
        // remove the disconnected client from the array of clients
        clients.splice(disconnectedClientIndexInArray, 1);
      });

      const registeredClients = clients.filter(i => i.username !== "");
      io.emit("client-list", { clients: registeredClients });
      //   socket.emit("news", { hello: "world" });

      const socketClientObj = {
        socketId: socket.id,
        username: ``
      };

      // add client to lists
      clients.push(socketClientObj);

      socket.on("send-private-message", data => {
        console.log(data, "datadatadata");
        io.to(data.toSocketId).emit("private-message", { message: data.msg });
      });

      socket.on("broadcast-message", data => {
        console.log(data, "datadatadata");
        // send data to all except to sender
        socket.broadcast.emit("broadcast-message", { message: data.msg });
      });
    });
  }
};
