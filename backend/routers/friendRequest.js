// backend/routers/friendRequest.js
import express from "express";
import authMiddleware from "./authMiddleware.js";
import UserModel from "../models/Users.js";

const router = express.Router();

router.post("/send/:id", authMiddleware, async (req, res) => {
    try {
        const senderId = req.user.id;
        const receiverId = req.params.id;

        if (senderId === receiverId) {
            return res.status(400).json({ message: "You cannot send request to yourself" });
        }

        const sender = await UserModel.findById(senderId);
        const receiver = await UserModel.findById(receiverId);

        if (!receiver) return res.status(404).json({ message: "User not found" });

        // Already friends?
        if (sender.friends.includes(receiverId)) {
            return res.status(400).json({ message: "Already friends" });
        }

        // Already requested (incoming or outgoing)?
        if (receiver.requests.includes(senderId) || sender.sentRequests.includes(receiverId)) {
            return res.status(400).json({ message: "Request already sent" });
        }

        // Update both users
        receiver.requests.push(senderId);   // incoming
        sender.sentRequests.push(receiverId); // outgoing

        await receiver.save();
        await sender.save();

        res.json({ message: "Friend request sent" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Get incoming requests
router.get("/incoming", authMiddleware, async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id)
            .populate("requests", "username email avatar");
        res.json({ requests: user.requests });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get sent requests
router.get("/sent", authMiddleware, async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id)
            .populate("sentRequests", "username email avatar");
        res.json({ sentRequests: user.sentRequests });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/accept/:id", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const senderId = req.params.id;

        const user = await UserModel.findById(userId);
        const sender = await UserModel.findById(senderId);

        if (!user.requests.includes(senderId)) {
            return res.status(400).json({ message: "No request from this user" });
        }

        // Remove from requests
        user.requests = user.requests.filter(id => id.toString() !== senderId);

        // Add to friends list
        user.friends.push(senderId);
        sender.friends.push(userId);

        await user.save();
        await sender.save();

        res.json({ message: "Friend request accepted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/my-friends", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await UserModel.findById(userId).populate("friends", "username email avatar");
        res.json(user.friends);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add friend to chats
router.post("/add-chat/:id", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;   // current user
        const friendId = req.params.id; // jis friend pe click kiya

        if (userId === friendId) {
            return res.status(400).json({ message: "You cannot chat with yourself" });
        }

        const user = await UserModel.findById(userId);
        const friend = await UserModel.findById(friendId);

        if (!friend) return res.status(404).json({ message: "Friend not found" });

        // Check if already added
        if (user.chats.includes(friendId)) {
            return res.status(400).json({ message: "Already in chats" });
        }

        // Push each other to chats list
        user.chats.push(friendId);
        friend.chats.push(userId);

        await user.save();
        await friend.save();

        res.json({ message: "Chat added successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get my chats
router.get("/my-chats", authMiddleware, async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id)
            .populate("chats", "username email avatar");
        res.json(user.chats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


export default router;










// /**
//  * @route POST /friend/cancel/:id
//  * @desc Cancel a sent friend request
//  */
// router.post("/cancel/:id", verifyToken, async (req, res) => {
//   try {
//     const senderId = req.user.id;
//     const receiverId = req.params.id;

//     const receiver = await UserModel.findById(receiverId);

//     if (!receiver.requests.includes(senderId)) {
//       return res.status(400).json({ message: "No pending request found" });
//     }

//     receiver.requests = receiver.requests.filter(id => id.toString() !== senderId);
//     await receiver.save();

//     res.json({ message: "Friend request cancelled" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// /**
//  * @route POST /friend/unfriend/:id
//  * @desc Unfriend a user
//  */
// router.post("/unfriend/:id", verifyToken, async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const friendId = req.params.id;

//     const user = await UserModel.findById(userId);
//     const friend = await UserModel.findById(friendId);

//     if (!user.friends.includes(friendId)) {
//       return res.status(400).json({ message: "Not in friends list" });
//     }

//     user.friends = user.friends.filter(id => id.toString() !== friendId);
//     friend.friends = friend.friends.filter(id => id.toString() !== userId);

//     await user.save();
//     await friend.save();

//     res.json({ message: "Unfriended successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// /**
//  * @route GET /friend/my-friends
//  * @desc Get all my friends
//  */


// /**
//  * @route GET /friend/requests
//  * @desc Get pending friend requests
//  */
// router.get("/requests", verifyToken, async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const user = await UserModel.findById(userId).populate("requests", "username email avatar");
//     res.json(user.requests);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// export default router;
