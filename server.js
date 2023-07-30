const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { getRoomId } = require("./custom/customRoomId");

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect(`/${getRoomId()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user-connected", userId);

    socket.on("disconnect", () => {
      socket.broadcast.to(roomId).emit("user-disconnected", userId);
    });
  });
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Listeing on Port: ${PORT}`));
