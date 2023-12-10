// src/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const mongoose = require('mongoose');
const app = express();
const server = require('http').Server(app);
const { initializeSocket } = require('./config/socket'); // Import socket configuration
const userRoutes = require('./routes/userRoutes');

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
  origin: "http://localhost:5173", // Mengizinkan akses dari alamat ini
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));

// Configure socket.io
const io = initializeSocket(server);

// Dummy endpoint for testing
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Use user routes
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  try{
      await mongoose.connect(`mongodb+srv://ChatAppMERN:ChatAppPassword@clusterchatapp.fdbtxsj.mongodb.net/ChatApp?retryWrites=true&w=majority`)
      console.log('Database connected')
  }
  catch(e){
      console.log('Error database connection \n', e)
  }
  console.log(`listening on port ${PORT}!`)
})