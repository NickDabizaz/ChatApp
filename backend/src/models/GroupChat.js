// models/GroupChat.js
const mongoose = require('mongoose');

const groupChatSchema = new mongoose.Schema({
  name: { type: String, required: true },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  messages: [
    {
      senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

const GroupChat = mongoose.model('GroupChat', groupChatSchema);

module.exports = GroupChat;
