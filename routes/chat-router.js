import express from "express";
import uploads from "../middleware/image-middleware.js";
import {
  SendMessage,
  recieveMessage,
  chatList,
  deleteMessage,
} from "../controllers/chat-controller.js";
import uploadToCloudinary from "../helper/upload-cloudinary.js";
import multer from "multer";

const router = express.Router();

router.post("/send", uploads.single("file"), SendMessage);
router.post("/recieve", recieveMessage);
router.post("/chats", chatList);
router.post("/delete/:id", deleteMessage);

export default router;
