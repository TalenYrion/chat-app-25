import Message3 from "../models/Message3.js";
import User from "../models/User.js";
import UserInfo from "../models/UserInfo.js";
import uploadToCloudinary from "../helper/upload-cloudinary.js";
import cloudinary from "../config/cloudinary.js";
import { connectedUsers } from "../server.js";

export const SendMessage = async (req, res) => {
  try {
    const { reciever_id, sender_id, message } = req.body;
    const file = req.file; // multer memoryStorage: contains buffer

    let imageUrl = null;
    let imageId = null;

    if (file) {
      // Pass buffer directly to uploadToCloudinary
      const uploadResult = await uploadToCloudinary(file.buffer);
      imageUrl = uploadResult.imageUrl;
      imageId = uploadResult.imageId;
    }

    const newMessage = new Message3({
      reciever_id,
      sender_id,
      message,
      imageUrl,
      imageId,
    });

    await newMessage.save();

    res.status(200).json({
      success: true,
      message: "message successfully saved",
      newMessage,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};

export const recieveMessage = async (req, res) => {
  try {
    const { selectedId, recieverId } = req.body;

    const messages = await Message3.find({
      $or: [
        { sender_id: selectedId, reciever_id: recieverId },
        { sender_id: recieverId, reciever_id: selectedId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      message: messages, // can be [] if no messages exist
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};

export const chatList = async (req, res) => {
  try {
    const { id: UserId } = req.body;
    if (!UserId) {
      return res.status(401).json({
        success: false,
        message: "UserId is missing",
      });
    }

    // Get all messages where the user is either sender or receiver
    const messages = await Message3.find({
      $or: [{ sender_id: UserId }, { reciever_id: UserId }],
    });

    if (!messages || messages.length === 0) {
      return res.status(401).json({
        success: false,
        message: "no chats",
      });
    }

    // Extract both sender and receiver IDs
    const recieverIds = messages.map((msg) => msg.reciever_id);
    const senderIds = messages.map((msg) => msg.sender_id);

    // Merge and remove duplicates + exclude your own ID
    const allContactIds = [...new Set([...recieverIds, ...senderIds])].filter(
      (id) => id !== UserId
    );

    // Fetch the actual user documents
    const users = await UserInfo.find({
      userId: { $in: allContactIds },
    }).populate("userId", "username");

    if (!users || users.length === 0) {
      return res.status(400).json({
        success: false,
        message: "user list is empty",
      });
    }

    res.status(200).json({
      success: true,
      message: "chats are found",
      users,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};

// export const loadMessages = async (req, res) => {
//   try {
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       success: false,
//       message: "something went wrong",
//     });
//   }
// };

export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params; // 👈 changed from req.body to req.params
    const io = req.io;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Message ID is required",
      });
    }

    // Step 1: Fetch the message first
    const message = await Message3.findById(id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    // Step 2: Delete the image from Cloudinary if it exists
    if (message.imageId) {
      await cloudinary.uploader.destroy(message.imageId);
    }

    // Step 3: Delete the message from MongoDB
    await Message3.findByIdAndDelete(id);

    io.to(connectedUsers[message.sender_id])?.emit("message_deleted", id);
    io.to(connectedUsers[message.reciever_id])?.emit("message_deleted", id);

    return res.status(200).json({
      success: true,
      message: "Message and associated image deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting message:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
