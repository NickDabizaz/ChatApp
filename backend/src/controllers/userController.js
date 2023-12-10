// src/controllers/userController.js
const User = require("../models/User");
const bcrypt = require("bcrypt");

const UserController = {
  registerUser: async (req, res) => {
    try {
      const { name, phoneNumber, password } = req.body;

      // Check if the phone number is already in use
      const existingUser = await User.findOne({ phoneNumber });
      if (existingUser) {
        return res.status(409).json({ error: "Nomor telepon sudah terdaftar" });
      }

      // Encrypt the password before saving it to the database
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({ name, phoneNumber, password: hashedPassword });
      await user.save();

      res.status(201).json({ message: "Pengguna berhasil terdaftar" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Kesalahan Server Internal" });
    }
  },

  loginUser: async (req, res) => {
    try {
      const { phoneNumber, password } = req.body;
      const user = await User.findOne({ phoneNumber });

      if (!user) {
        return res.status(404).json({ error: "Nomor telepon tidak ditemukan" });
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch) {
        return res.status(401).json({ error: "Kata sandi salah" });
      }

      res.status(200).json({ userId: user._id, message: "Login berhasil" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Kesalahan Server Internal" });
    }
  },

  addFriend: async (req, res) => {
    try {
      const { userId, friendPhoneNumber } = req.body;
      const user = await User.findById(userId);
      const friend = await User.findOne({ phoneNumber: friendPhoneNumber });

      if (!user || !friend) {
        return res.status(404).json({ error: "User or friend not found" });
      }

      const existingRequest = user.friends.find(
        (friend) => friend.friendId.toString() === friend._id.toString()
      );

      if (existingRequest) {
        return res.status(400).json({ error: "Friend request already sent" });
      }

      user.friends.push({ friendId: friend._id, status: "pending" });
      friend.friends.push({ friendId: user._id, status: "pending" });

      await user.save();
      await friend.save();

      res.status(201).json({ message: "Friend request sent successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  sendMessage: async (req, res) => {
    try {
      const { userId, friendId, content } = req.body;
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: "User tidak ditemukan" });
      }
  
      // Temukan objek teman yang spesifik
      const userFriend = user.friends.find(
        (friendObj) => friendObj.friendId.toString() === friendId
      );
  
      // Tambahkan pesan ke kotak pesan pengguna
      userFriend.messages.push({
        senderId: userId,
        receiverId: friendId,
        content,
      });
  
      // Simpan perubahan
      await user.save();
  
      res.status(201).json({ message: "Pesan berhasil dikirim" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Kesalahan Server Internal" });
    }
  },
  

  getChatHistory: async (req, res) => {
    try {
      const { userId, friendId } = req.params;
      const user = await User.findById(userId);
      const friend = await User.findById(friendId);

      if (!user || !friend) {
        return res
          .status(404)
          .json({ error: "User atau teman tidak ditemukan" });
      }

      const userMessages = user.friends.find(
        (friendObj) => friendObj.friendId._id.toString() === friendId
      ).messages;

      const friendMessages = friend.friends.find(
        (friendObj) => friendObj.friendId._id.toString() === userId
      ).messages;

      const chatHistory = [...userMessages, ...friendMessages].sort(
        (a, b) => a.timestamp - b.timestamp
      );

      res.status(200).json(chatHistory);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Kesalahan Server Internal" });
    }
  },

  // src/controllers/userController.js

  getUserDetails: async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId).populate(
        "friends.friendId",
        "name status messages"
      );

      if (!user) {
        return res.status(404).json({ error: "Pengguna tidak ditemukan" });
      }

      const userDetails = {
        name: user.name,
        phoneNumber: user.phoneNumber,
        friends: [],
        chatHistory: [],
      };

      userDetails.friends = user.friends.map((friend) => ({
        friendId: friend.friendId._id,
        name: friend.friendId.name,
        status: friend.status,
        messages: (friend.messages || []).map((message) => ({
          senderId: message.senderId,
          receiverId: message.receiverId,
          content: message.content,
          timestamp: message.timestamp.toISOString(),
          isRead: message.isRead,
        })),
      }));

      userDetails.chatHistory = (user.messages || []).map((message) => ({
        senderId: message.senderId,
        receiverId: message.receiverId,
        content: message.content,
        timestamp: message.timestamp.toISOString(),
        isRead: message.isRead,
      }));

      res.status(200).json(userDetails);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Kesalahan Server Internal" });
    }
  },

  getUserFriends: async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId).populate(
        "friends.friendId",
        "name status messages"
      );

      if (!user) {
        return res.status(404).json({ error: "Pengguna tidak ditemukan" });
      }

      const userFriends = user.friends.map((friend) => ({
        friendId: friend.friendId._id,
        name: friend.friendId.name,
        status: friend.status,
        messages: friend.messages,
      }));

      res.status(200).json(userFriends);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Kesalahan Server Internal" });
    }
  },

  acceptFriendRequest: async (req, res) => {
    try {
      const { userId, friendId } = req.body;
      const user = await User.findById(userId);
      const friend = await User.findById(friendId);

      if (!user || !friend) {
        return res
          .status(404)
          .json({ error: "User atau teman tidak ditemukan" });
      }

      const friendObj = user.friends.find(
        (friend) => friend.friendId.toString() === friendId
      );
      if (!friendObj) {
        return res.status(404).json({ error: "Teman tidak ditemukan" });
      }

      friendObj.status = "accepted";

      await user.save();

      res.status(200).json({ message: "Permintaan pertemanan diterima" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Kesalahan Server Internal" });
    }
  },

  rejectFriendRequest: async (req, res) => {
    try {
      const { userId, friendId } = req.body;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: "User tidak ditemukan" });
      }

      user.friends = user.friends.filter(
        (friend) => friend.friendId.toString() !== friendId
      );

      await user.save();

      res.status(200).json({ message: "Permintaan pertemanan ditolak" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Kesalahan Server Internal" });
    }
  },
  // src/controllers/userController.js
  readMessage: async (req, res) => {
    try {
      const { userId, friendId, messageId } = req.params;
  
      // Cari pengguna yang sedang membaca pesan
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: "Pengguna tidak ditemukan" });
      }
  
      // Cari teman di dalam daftar teman pengguna
      const friendObj = user.friends.find((friend) => friend.friendId.toString() === friendId);
  
      if (!friendObj) {
        return res.status(404).json({ error: "Teman tidak ditemukan" });
      }
  
      // Cari pesan di dalam teman
      const message = friendObj.messages.find((msg) => msg._id.toString() === messageId);
  
      if (!message) {
        return res.status(404).json({ error: "Pesan tidak ditemukan" });
      }
  
      // Tandai pesan sebagai sudah dibaca
      message.isRead = true;
  
      // Simpan perubahan
      await user.save();
  
      return res.status(200).json({
        message: "Pesan berhasil ditandai sebagai sudah dibaca",
        senderId: message.senderId,
        receiverId: message.receiverId,
        content: message.content,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Kesalahan Server Internal" });
    }
  },
  getAllUsers: async (req, res) => {
    try {
      // Ambil semua pengguna dari database
      const users = await User.find({}, 'name phoneNumber');
      // const users = await User.findAll();
  
      return res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Kesalahan Server Internal" });
    }
  },
  getLastMessage: async (req, res) => {
    try {
      const { userId, friendId } = req.params;
  
      // Cari pengguna yang sedang membaca pesan
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: "Pengguna tidak ditemukan" });
      }
  
      // Cari teman di dalam daftar teman pengguna
      const friendObj = user.friends.find((friend) => friend.friendId.toString() === friendId);
  
      if (!friendObj) {
        return res.status(404).json({ error: "Teman tidak ditemukan" });
      }
  
      // Ambil last message dari teman
      const lastMessage = friendObj.messages.reduce((prev, current) =>
        prev.timestamp > current.timestamp ? prev : current
      );
  
      if (!lastMessage) {
        return res.status(404).json({ error: "Pesan tidak ditemukan" });
      }
  
      return res.status(200).json({
        senderId: lastMessage.senderId,
        receiverId: lastMessage.receiverId,
        content: lastMessage.content,
        timestamp: lastMessage.timestamp,
        isRead: lastMessage.isRead,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Kesalahan Server Internal" });
    }
  },

};

module.exports = UserController;
