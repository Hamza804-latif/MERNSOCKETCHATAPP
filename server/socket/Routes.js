import RoomsModel from "../models/Room.js";
import fs from "fs";

export const socket = (socket) => {
  console.log("new connection");
  socket.on("message", (msg, id) => {
    let skt = socket.broadcast;
    skt = id ? skt.to(id) : skt;
    skt.emit("message-from-server", msg);
  });
  socket.on("typing-started", ({ id }) => {
    let skt = socket.broadcast;
    skt = id ? skt.to(id) : skt;
    skt.emit("typing-started-server");
  });
  socket.on("typing-ended", ({ id }) => {
    let skt = socket.broadcast;
    skt = id ? skt.to(id) : skt;
    skt.emit("typing-ended-server");
  });
  socket.on("join-room", ({ roomId }) => {
    socket.join(roomId);
  });
  socket.on("new-room-created", async ({ roomId, userId }) => {
    const makeRoom = new RoomsModel({
      roomId,
      name: "Test",
      userId,
    });
    try {
      await makeRoom.save();
    } catch (error) {
      console.log("Room save error", error);
    }
    socket.broadcast.emit("new-room-created", { roomId });
  });

  socket.on("room-removed", async ({ roomId }) => {
    try {
      await RoomsModel.deleteOne({ roomId });
      socket.broadcast.emit("room-removed-server", { roomId });
      socket.emit("room-removed-server", { roomId });
    } catch (error) {
      console.log("error in deleting room", error.message);
    }
  });

  socket.on("file-upload", (data, { roomId }) => {
    fs.writeFile("test.png", data, { encoding: "base64" }, (err) => {
      if (err) return console.log("error", err);
    });
    socket.to(roomId).emit("uploaded", { buffer: data.toString("base64") });
  });
  socket.on("disconnect", () => {
    console.log("user left");
  });
};
