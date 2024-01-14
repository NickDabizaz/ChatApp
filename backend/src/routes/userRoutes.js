const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const upload = require("../utils/multerConfiguration");

//register a new user
router.post("/register", UserController.registerUser);

//get all existing user
router.get("/all-users", UserController.getAllUsers);

//user login
router.post("/login", UserController.loginUser);

//user send friend request to another user
router.post("/add-friend", UserController.addFriend);

//user edit profile
router.put("/edit-profile/:userId", UserController.editProfile);

//user send message to friend
router.post("/send-message", UserController.sendMessage);

//friend request
//accept
router.post("/accept-friend-request", UserController.acceptFriendRequest);
//decline
router.post("/reject-friend-request", UserController.rejectFriendRequest);

//get the entire chat of user with their friend
router.get("/chat-history/:userId/:friendId", UserController.getChatHistory);

//get a certain user detail using their id
router.get("/user-details/:userId", UserController.getUserDetails);

//get a certain user detail using their phone number
router.get(
  "/user-details-by-phone/:phoneNumber",
  UserController.getUserByPhoneNumber
);

//get all of user friends
router.get("/user-friends/:userId", UserController.getUserFriends);

//mark message as read
router.put(
  "/read-message/:userId/:friendId/:messageId",
  UserController.readMessage
);

//get last message
router.get("/last-message/:userId/:friendId", UserController.getLastMessage);

//profil picture
//uplod
router.post("/:type/:user_id", upload.single("file"), UserController.profilpic);
//get
router.get("/pic/:user_id", UserController.getProfilpic);

//image chat
//friend
//upload
router.post(
  "/friend/:type/:userId/:friendId",
  upload.single("file"),
  UserController.chatImage
);
//get
router.get("/messagePic/:messageId", UserController.getChatImage);

//group
//upload
router.post(
  "/group/:type/:groupId",
  upload.single("file"),
  UserController.chatImageGroup
);
//get
router.get("/messagePicGroup/:messageId", UserController.getChatImageGroup);

//group image
//get
router.get("/pic/:groupId", UserController.getGroupImage);


//get all friend request directed to user
router.get("/friend-requests/:userId", UserController.getFriendRequests);

module.exports = router;
