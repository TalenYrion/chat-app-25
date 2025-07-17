import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    sender_id: {
      required: true,
      type: String,
    },
    reciever_id: {
      required: true,
      type: String,
    },
    message: {
      type: String,
    },
    imageUrl: {
      type: String, // Cloudinary image URL (optional)
      default: null,
    },
    imageId: {
      type: String, // Cloudinary public_id (optional)
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Message3", MessageSchema);
