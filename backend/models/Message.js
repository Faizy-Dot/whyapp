// models/Message.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId, // reference to the chat (conversation)
      ref: "Chat",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId, // user who sent the message
      ref: "User",
      required: true,
    },
    messageType: {
      type: String,
      enum: ["text", "image"],
      default: "text",
    },
    text: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String, // store Cloudinary/S3/Firebase URL
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // gives createdAt, updatedAt
);

export default mongoose.models.Message ||
  mongoose.model("Message", messageSchema);
