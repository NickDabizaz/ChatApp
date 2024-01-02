const express = require('express');
const router = express.Router();
const GroupChatController = require('../controllers/groupChatController.js');

// Membuat Group Chat
router.post('/create', GroupChatController.createGroupChat);

// Menambahkan Anggota ke dalam Group Chat
router.post('/:groupId/addMember', GroupChatController.addMemberToGroup);

// Mengirim Pesan ke dalam Group Chat
router.post('/:groupId/sendMessage', GroupChatController.sendMessageToGroup);

// Mengambil Semua Pesan dalam Group Chat (diurutkan dari yang terlama sampai terbaru)
router.get('/:groupId/messages', GroupChatController.getAllMessagesInGroup);

// Mengambil Detail Group Chat
router.get('/:groupId/details', GroupChatController.getGroupDetails);

module.exports = router;
