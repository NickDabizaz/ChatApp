// src/utils/socket.js
const socketIO = require('socket.io');

let io;

const initializeSocket = (server) => {
  io = socketIO(server);

  io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle socket events here

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized!');
  }
  return io;
};

module.exports = { initializeSocket, getIO };
