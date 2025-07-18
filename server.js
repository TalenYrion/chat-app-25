import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http"; // <-- added
import { Server } from "socket.io"; // <-- added
import connecteToDB from "./database/db.js";
import authRouter from "./routes/auth-route.js";
import middlewareRoute from "./routes/middleware-route.js";
import userRouter from "./routes/user-route.js";
import chatRouter from "./routes/chat-router.js";
import userInfoRouter from "./routes/userInfo-route.js";
import cookiesParser from "cookie-parser";
import cors from "cors";

const app = express();
const server = http.createServer(app); // <-- use this instead of app.listen
const io = new Server(server, {
  cors: {
    origin: "https://chat-app-front-2c6r.onrender.com",
    credentials: true,
  },
});

const PORT = process.env.PORT;

app.use(express.json());
app.use(
  cors({
    origin: "https://chat-app-front-2c6r.onrender.com",
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

// your existing routes
app.use("/auth", authRouter);
app.use("/security", middlewareRoute);
app.use("/user", userRouter);
app.use("/chat", chatRouter);
app.use("/userInfo", userInfoRouter);

// 🧠 Add socket.io logic here
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

      // Save to DB here (MongoDB):
      // Message.create({ senderId, receiverId, message, imageFile, timestamp: new Date() });
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

// 🟢 Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
