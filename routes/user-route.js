import express from "express";
import { userList, oneUser } from "../controllers/user-controller.js";
import authMiddleware from "../middleware/auth-middleware.js";

const router = express.Router();

router.get("/userList", authMiddleware, userList);
router.get("/oneUser", authMiddleware, oneUser);

export default router;
