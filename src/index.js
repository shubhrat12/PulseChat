const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const { generateMessage, generateLocationMessage } = require("./utils/messages");
const { addUser, removeUser, getUser, getUsersInRoom } = require("./utils/user");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const host = process.env.HOST || "0.0.0.0";

const publicDirectoryPath = path.join(__dirname, "../public");
app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
  console.log("New WebSocket connection");

  // Join room
  socket.on("join", ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room });

    if (error) {
      return callback(error);
    }

    socket.join(user.room);

    // Welcome the joining user
    socket.emit("message", generateMessage("ChatBot", `Welcome to ${user.room.toUpperCase()} room, ${user.username}! 👋`));

    // Broadcast to everyone else in the room
    socket.broadcast
      .to(user.room)
      .emit("message", generateMessage("ChatBot", `${user.username} has joined the room! 🎉`));

    // Send updated room data
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  // Listen for new messages
  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    if (!user) {
      return callback("User not found. Please rejoin the room.");
    }

    if (!message || !message.trim()) {
      return callback("Message cannot be empty.");
    }

    io.to(user.room).emit("message", generateMessage(user.username, message));
    callback();
  });

  // Send location
  socket.on("sendLocation", (coords, callback) => {
    const user = getUser(socket.id);

    if (!user) {
      return callback("User not found.");
    }

    io.to(user.room).emit(
      "locationMessage",
      generateLocationMessage(
        user.username,
        `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
      )
    );

    callback();
  });

  // Typing indicators
  socket.on("typing", () => {
    const user = getUser(socket.id);
    if (user) {
      socket.broadcast.to(user.room).emit("userTyping", { username: user.username });
    }
  });

  socket.on("stopTyping", () => {
    const user = getUser(socket.id);
    if (user) {
      socket.broadcast.to(user.room).emit("userStopTyping", { username: user.username });
    }
  });

  // Disconnect
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        generateMessage("ChatBot", `${user.username} has left the room. 👋`)
      );

      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

server.listen(port, host, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
