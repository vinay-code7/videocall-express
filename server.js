const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json()); // Used to parse JSON bodies
app.use(express.urlencoded({ extended: true })); //Parse URL-encoded bodies

app.get("/", (req, res) => {
  res.render("form");
});

app.post("/room", (req, res) => {
  res.redirect(`/${req.body.roomId}`);
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

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Listeing on Port: ${PORT}`));
