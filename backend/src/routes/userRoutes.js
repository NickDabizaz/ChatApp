const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const upload = require("../utils/multerConfiguration")

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

//profil picture
router.post("/:type/:user_id", upload.single("file"), UserController.profilpic);

router.get("/pic/:user_id", UserController.getProfilpic);

//image chat
router.post("/:type/:userId/:friendId", upload.single("file"), UserController.chatImage);

router.get("/messagePic/:messageId", UserController.getChatImage);

module.exports = router;
