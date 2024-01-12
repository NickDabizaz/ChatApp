const GroupChat = require("../models/GroupChat");
const Joi = require("joi");

const createGroupChatValidation = Joi.object({
  name: Joi.string().required(),
  admin: Joi.string().required(),
});

const addMemberValidation = Joi.object({
  memberId: Joi.string().required(),
});

const sendMessageValidation = Joi.object({
  senderId: Joi.string().required(),
  content: Joi.string().required(),
});

const GroupChatController = {
  createGroupChat: async (req, res) => {
    try {
      const { name, admin } = req.body;

      console.log(name + " " + admin);
      const { error } = createGroupChatValidation.validate({ name, admin });
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const groupChat = await GroupChat.create({ name, admin, members: [] });

      const response = {
        message: "Group chat created successfully",
        data: {
          groupId: groupChat._id,
          name: groupChat.name,
          admin: groupChat.admin,
          members: groupChat.members,
        },
      };

      res.status(201).json(response);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  addMemberToGroup: async (req, res) => {
    try {
      const { memberId } = req.body;
      const groupId = req.params.groupId;

      const { error } = addMemberValidation.validate({ memberId });
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const groupChat = await GroupChat.findById(groupId);
      if (!groupChat) {
        return res.status(404).json({ error: "GroupChat not found" });
      }

      if (
        groupChat.admin.toString() !== memberId.toString() &&
        !groupChat.members.includes(memberId)
      ) {
        groupChat.members.push(memberId);
        await groupChat.save();
      }

      const response = {
        message: "Member added to group successfully",
        data: {
          groupId: groupChat._id,
          members: groupChat.members,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error", error });
    }
  },

  sendMessageToGroup: async (req, res) => {
    try {
      const { senderId, content } = req.body;
      const groupId = req.params.groupId;

      const { error } = sendMessageValidation.validate({ senderId, content });
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const groupChat = await GroupChat.findById(groupId);
      if (!groupChat) {
        return res.status(404).json({ error: "GroupChat not found" });
      }

      groupChat.messages.push({ senderId, content });
      await groupChat.save();

      const newMessage = groupChat.messages[groupChat.messages.length - 1];

      const response = {
        message: "Message sent successfully",
        data: {
          groupId: groupChat._id,
          senderId: newMessage.senderId,
          content: newMessage.content,
          timestamp: newMessage.timestamp,
        },
      };

      res.status(201).json(response);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getAllMessagesInGroup: async (req, res) => {
    try {
      const groupId = req.params.groupId;
      const groupChat = await GroupChat.findById(groupId).populate(
        "messages.senderId",
        "name _id"
      );
      if (!groupChat) {
        return res.status(404).json({ error: "GroupChat not found" });
      }

      const messages = groupChat.messages.map((message) => ({
        messageId: message._id,
        senderId: message.senderId._id,
        sender: message.senderId.name,
        content: message.content,
        timestamp: message.timestamp,
      }));

      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getGroupDetails: async (req, res) => {
    try {
      const groupId = req.params.groupId;
      const groupDetails = await GroupChat.findById(groupId).populate(
        "admin members",
        "name _id"
      );
      if (!groupDetails) {
        return res.status(404).json({ error: "GroupChat not found" });
      }

      const memberDetails = groupDetails.members.map((member) => ({
        userId: member._id,
        name: member.name,
        role: "member",
      }));

      const chatDetails = groupDetails.messages.map((message) => ({
        messageId: message._id,
        senderId: message.senderId._id,
        sender: message.senderId.name,
        content: message.content,
        timestamp: message.timestamp,
      }));

      const details = {
        groupId: groupDetails._id,
        groupName: groupDetails.name,
        admin: {
          userId: groupDetails.admin._id,
          name: groupDetails.admin.name,
          role: "admin",
        },
        memberCount: groupDetails.members.length,
        members: memberDetails,
        totalMessages: groupDetails.messages.length,
        messages: chatDetails,
      };

      res.status(200).json(details);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getUserGroups: async (req, res) => {
    try {
      const userId = req.params.userId;

      // Cari semua group dimana user adalah admin
      const adminGroups = await GroupChat.find({ admin: userId })
        .populate("admin", "_id name") // Menggunakan populate untuk mengambil detail admin
        .populate("members", "_id name"); // Menggunakan populate untuk mengambil detail members

      // Cari semua group dimana user adalah member
      const memberGroups = await GroupChat.find({ members: userId })
        .populate("admin", "_id name") // Menggunakan populate untuk mengambil detail admin
        .populate("members", "_id name"); // Menggunakan populate untuk mengambil detail members

      // Gabungkan kedua array group
      const allGroups = adminGroups.concat(memberGroups);

      // Format ulang output sesuai kebutuhan
      const formattedGroups = allGroups.map((group) => ({
        idGroup: group._id,
        name: group.name,
        admin: {
          idUser: group.admin._id,
          name: group.admin.name,
        },
        members: group.members.map((member) => ({
          idUser: member._id,
          name: member.name,
        })),
      }));

      const response = {
        totalGroups: formattedGroups.length,
        groups: formattedGroups,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

module.exports = GroupChatController;
