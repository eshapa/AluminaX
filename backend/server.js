require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const Message = require("./models/Message");
const Conversation = require("./models/Conversation");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/database")
  .then(() => console.log("MongoDB Connected"));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/match", require("./routes/match"));
app.use("/api/request", require("./routes/request"));
app.use("/api/opportunity", require("./routes/opportunity"));
app.use("/api/session", require("./routes/session"));
app.use("/api/notification", require("./routes/notification"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/chat", require("./routes/chat"));

// Socket.io logic
const onlineUsers = new Map();

io.on("connection", (socket) => {
  socket.on("addUser", (userId) => {
    console.log("User identifying as:", userId, "Socket ID:", socket.id);
    onlineUsers.set(userId, socket.id);
    io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
  });

  socket.on("sendMessage", async ({ senderId, receiverId, text, conversationId }) => {
    try {
      const newMessage = await Message.create({ conversationId, sender: senderId, text });
      await Conversation.findByIdAndUpdate(conversationId, { lastMessage: newMessage._id });
      await newMessage.populate("sender", "name email");

      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("getMessage", newMessage);
      }
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("disconnect", () => {
    for (let [id, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(id);
        break;
      }
    }
    io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
  });
});

server.listen(5000, () => console.log("Server running"));