import express from "express";
import { CreateUser } from "../controllers/UserInfo-controller.js";
import authMiddleware from "../middleware/auth-middleware.js";
import uploads from "../middleware/image-middleware.js";

const router = express.Router();

router.post("/save", authMiddleware, uploads.single("profilePic"), CreateUser);

export default router;
