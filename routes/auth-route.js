import express from "express";
import {
  register,
  signIn,
  LogOut,
  verifyUserInfo,
} from "../controllers/auth-controllers.js";

const router = express.Router();

router.post("/register", register);
router.post("/sign-in", signIn);
router.get("/log-out", LogOut);
router.post("/verify", verifyUserInfo);

export default router;
