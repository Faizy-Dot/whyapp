import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "" }, // Cloudinary image URL

    // Confirmed friends
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    ],

    // Incoming requests (other users → me)
    requests: [
      {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    ],

    // Outgoing requests (me → other users)
    sentRequests: [
      {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    ],

    // Chats (store reference to other users I have chats with)
    chats: [
      {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    ],
  },
  { timestamps: true }
);

const UserModel = mongoose.model("users", userSchema);

export default UserModel;
