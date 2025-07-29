import express from "express";
import { CreateUser, EditPic } from "../controllers/UserInfo-controller.js";
import authMiddleware from "../middleware/auth-middleware.js";
import uploads from "../middleware/image-middleware.js";
import multer from "multer";

const router = express.Router();

router.post(
  "/save",
  authMiddleware,
  (req, res, next) => {
    uploads.single("profilePic")(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: "file too big" });
      } else if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  CreateUser
);

router.post(
  "/update",
  authMiddleware,
  (req, res, next) => {
    uploads.single("profilePic")(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: "file too big" });
      } else if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  EditPic
);

export default router;
