// src/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  friends: [
    {
      friendId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      status: {
        type: String,
        enum: ["pending", "accepted"],
        default: "pending",
      },
      messages: [
        {
          senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          content: { type: String, required: true },
          timestamp: { type: Date, default: Date.now },
          isRead: { type: Boolean, default: false },
        },
      ],
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
