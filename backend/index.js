// src/server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const userRoutes = require("./src/routes/userRoutes");
const groupChatRoutes = require("./src/routes/groupChatRoutes");
const socket = require("socket.io");

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
  origin: "https://main--dapper-mousse-59f527.netlify.app", // Mengizinkan akses dari alamat ini
  // origin: "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));


// Dummy endpoint for testing
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Use user routes
app.use("/api/users", userRoutes);
app.use("/api/group-chats", groupChatRoutes);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://ChatAppMERN:ChatAppPassword@clusterchatapp.fdbtxsj.mongodb.net/ChatApp?retryWrites=true&w=majority`
    );
    console.log("Database connected");
  } catch (e) {
    console.log("Error database connection \n", e);
  }
  console.log(`listening on port ${PORT}!`);
});

const io = socket(server, {
  cors: {
    origin: "https://main--dapper-mousse-59f527.netlify.app",
    // origin: "http://localhost:5173",
    credentials: true,
  },
});

// global.onlineUsers = new Map();
// io.on("connection", (socket) => {
//   global.chatSocket = socket;
//   socket.on("add-user", (userId) => {
//     onlineUsers.set(userId, socket.id);
//   });

//   socket.on("send-msg", (data) => {
//     console.log({dataDariMessage : data});
//     const sendUserSocket = onlineUsers.get(data.to);
//     if (sendUserSocket) {
//       socket.to(sendUserSocket).emit("msg-recieve", data.content);
//     }
//   });
// });

// Socket.IO connection
io.on('connection', (socket) => {
  // console.log('A user connected');

  // Handle chat messages
  socket.on('chat message', (message) => {
    io.emit('chat message', message);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
