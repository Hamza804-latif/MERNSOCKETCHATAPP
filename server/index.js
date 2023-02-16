import express from "express";
import { Server } from "socket.io";
import http from "http";
import { socket } from "./socket/Routes.js";
import mongoose from "mongoose";
import router from "./Routes/index.js";
import cors from "cors";

mongoose.set("strictQuery", true);
mongoose.connect("mongodb://localhost:27017/SocketAppPractice", () => {
  console.log("Database Connected");
});

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: true,
});

io.on("connection", socket);
app.use(cors());
app.use("/", router);

httpServer.listen(5000, () => {
  console.log("Server is live on http://localhost:5000");
});
