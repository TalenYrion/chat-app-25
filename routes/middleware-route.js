import express from "express";
import authMiddleware from "../middleware/auth-middleware.js";

const router = express.Router();

router.get("/verify", authMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    id: req.user.id,
    username: req.user.username,
    email: req.user.email,
  });
});

export default router;
