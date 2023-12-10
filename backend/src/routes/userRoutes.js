const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");

router.post("/register", UserController.registerUser);
router.get("/all-users", UserController.getAllUsers);
router.post("/login", UserController.loginUser);
router.post("/add-friend", UserController.addFriend);
router.post("/send-message", UserController.sendMessage);
router.post("/accept-friend-request", UserController.acceptFriendRequest);
router.post("/reject-friend-request", UserController.rejectFriendRequest);
router.get("/chat-history/:userId/:friendId", UserController.getChatHistory);
router.get("/user-details/:userId", UserController.getUserDetails);
router.get("/user-friends/:userId", UserController.getUserFriends);
router.put(
  "/read-message/:userId/:friendId/:messageId",
  UserController.readMessage
);
router.get("/last-message/:userId/:friendId", UserController.getLastMessage);

module.exports = router;
