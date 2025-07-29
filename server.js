import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import { Server } from "socket.io";
import connecteToDB from "./database/db.js";
import authRouter from "./routes/auth-route.js";
import middlewareRoute from "./routes/middleware-route.js";
import userRouter from "./routes/user-route.js";
import chatRouter from "./routes/chat-router.js";
import userInfoRouter from "./routes/userInfo-route.js";
import cookiesParser from "cookie-parser";
import cors from "cors";

const app = express();
const CLIENT_URL = process.env.CLIENT_URL;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    credentials: true,
  },
});

// https://chat-app-front-2c6r.onrender.com

const PORT = process.env.PORT;

app.use(express.json());
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT"],
  })
);
app.use(cookiesParser());
connecteToDB();

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/auth", authRouter);
app.use("/security", middlewareRoute);
app.use("/user", userRouter);
app.use("/chat", chatRouter);
app.use("/userInfo", userInfoRouter);

export const connectedUsers = {};

io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  socket.on("join", (userId) => {
    connectedUsers[userId] = socket.id;
    console.log("✅ User joined:", userId);
    console.log("connectedUsers:", connectedUsers);
    io.emit("online_users", Object.keys(connectedUsers));
  });

  socket.on(
    "send_message",
    ({ senderId, receiverId, message, imageFile, _id, createdAt }) => {
      const receiverSocket = connectedUsers[receiverId];

      console.log("connectedUsers: ", connectedUsers);

      if (receiverSocket) {
        io.to(receiverSocket).emit("receive_message", {
          senderId,
          message,
          imageFile,
          receiverId,
          _id,
          createdAt,
        });
        console.log("receiverSocket: ", receiverSocket);

        console.log("data: ", senderId, " ", message);
      }
    }
  );

  socket.on("disconnect", () => {
    for (const userId in connectedUsers) {
      if (connectedUsers[userId] === socket.id) {
        delete connectedUsers[userId];
        break;
      }
    }
    console.log("❌ User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
