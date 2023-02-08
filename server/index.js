import express from "express";
import { Server } from "socket.io";
import http from "http";

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: true,
});

io.on("connection", (socket) => {
  console.log("new connection");
  socket.on("message", (msg) => {
    socket.broadcast.emit("message-from-server", msg);
  });
  socket.on("typing-started", () => {
    socket.broadcast.emit("typing-started-server");
  });
  socket.on("typing-ended", () => {
    socket.broadcast.emit("typing-ended-server");
  });
  socket.on("disconnect", () => {
    console.log("user left");
  });
});

httpServer.listen(5000, () => {
  console.log("Server is live on http://localhost:5000");
});
