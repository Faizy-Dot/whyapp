// server.js (or update your existing server file)
import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import "dotenv/config";
import { createServer } from "http";
import { Server } from "socket.io";

import authRoutes from "./routers/auth.js";
import friendRequestRoutes from "./routers/friendRequest.js";
import messageActionRoutes from "./routers/messageActions.js";
import Chats from "./models/Chats.js"
import Message from "./models/Message.js"

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" }, // adjust origin for production
});

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/auth", authRoutes);
app.use("/friendRequest", friendRequestRoutes);
app.use("/messageActions", messageActionRoutes);

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // join a chat room
  socket.on("joinChat", (chatId) => {
    if (!chatId) return;
    socket.join(chatId.toString());
    console.log(`Socket ${socket.id} joined chat ${chatId}`);
  });

  socket.on("leaveChat", (chatId) => {
    if (!chatId) return;
    socket.leave(chatId.toString());
    console.log(`Socket ${socket.id} left chat ${chatId}`);
  });

  // handle incoming message (client sends 'sendMessage')
  socket.on("sendMessage", async (data) => {
    // data: { chatId?, senderId, receiverId?, messageType, text, imageUrl }
    try {
      let chat = null;

      if (data.chatId) {
        chat = await Chats.findById(data.chatId);
      } else if (data.senderId && data.receiverId) {
        chat = await Chats.findOne({
          participants: { $all: [data.senderId, data.receiverId] },
        });
        if (!chat) {
          chat = new Chats({ participants: [data.senderId, data.receiverId] });
          await chat.save();
        }
      } else {
        return socket.emit("error", { message: "Missing chatId or participants" });
      }

      const newMessage = new Message({
        chatId: chat._id,
        senderId: data.senderId,
        messageType: data.messageType || "text",
        text: data.text,
        imageUrl: data.imageUrl,
      });

      const saved = await newMessage.save();

      // update chat preview
      chat.lastMessage = data.text || "📷 Image";
      await chat.save();

      // emit the saved message to everyone in the chat room
      io.to(chat._id.toString()).emit("message", saved);
    } catch (err) {
      console.error("Socket sendMessage error:", err);
      socket.emit("error", { message: "Failed to save message" });
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// DB connect + start HTTP server (Socket.IO needs httpServer.listen)
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    const PORT = process.env.PORT || 5000;
    httpServer.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  })
  .catch((err) => console.log("MongoDB error:", err));
