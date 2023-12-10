// src/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);
router.post('/add-friend', UserController.addFriend);
router.post('/send-message', UserController.sendMessage);
router.post('/accept-friend-request', UserController.acceptFriendRequest);
router.post('/reject-friend-request', UserController.rejectFriendRequest);
router.get('/chat-history/:userId/:friendId', UserController.getChatHistory);

// Rute baru untuk detail pengguna dan teman-temannya
router.get('/user-details/:userId', UserController.getUserDetails);
router.get('/user-friends/:userId', UserController.getUserFriends);

// New route for reading a message
// src/routes/userRoutes.js
router.put('/read-message/:userId/:friendId/:messageId', UserController.readMessage);


module.exports = router;
