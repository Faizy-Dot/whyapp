import express from "express";
import Message from "../models/Message.js";
import Chats from "../models/Chats.js";

const router = express.Router();

// 📌 Send a new message
router.post("/sendMessage", async (req, res) => {
  try {
    const { senderId, receiverId, messageType, text, imageUrl } = req.body;

    // Check if chat exists
    let chat = await Chats.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    // If no chat, create one
    if (!chat) {
      chat = new Chats({ participants: [senderId, receiverId] });
      await chat.save();
    }

    // Create message
    const newMessage = new Message({
      chatId: chat._id,
      senderId,
      messageType,
      text,
      imageUrl,
    });

    const savedMessage = await newMessage.save();

    // Update lastMessage in chat
    chat.lastMessage = text || "📷 Image";
    await chat.save();

    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(500).json({ error: "Failed to send message", details: error });
  }
});

// 📌 Get all messages in a chat
router.get("/allMessages/:chatId", async (req, res) => {
    console.log("from backend==>>" ,req.params.chatId )
  try {
    const messages = await Message.find({ chatId: req.params.chatId }).sort({
      createdAt: 1,
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages", details: error });
  }
});


router.get("/getChatId/:userId1/:userId2", async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;

    // Check if chat already exists
    let chat = await Chats.findOne({
      participants: { $all: [userId1, userId2] },
    });

    // If no chat, create a new one
    if (!chat) {
      chat = new Chats({ participants: [userId1, userId2] });
      await chat.save();
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ error: "Failed to get chat", details: error.message });
  }
});


// 📌 Mark a message as read
router.patch("/messageRead/:id", async (req, res) => {
  try {
    const updated = await Message.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update message", details: error });
  }
});

export default router;
