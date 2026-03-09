import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessage: {
      type: String, // optional preview of the last message
    },
  },
  { timestamps: true }
);

export default mongoose.models.Chats || mongoose.model("Chats", chatSchema);
