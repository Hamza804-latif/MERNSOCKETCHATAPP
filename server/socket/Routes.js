import RoomsModel from "../models/Room.js";

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
  socket.on("new-room-created", async ({ roomId }) => {
    const makeRoom = new RoomsModel({
      roomId,
      name: "Test",
    });
    try {
      await makeRoom.save();
    } catch (error) {
      console.log("Room save error", error);
    }
    socket.broadcast.emit("new-room-created", { roomId });
  });
  socket.on("disconnect", () => {
    console.log("user left");
  });
};
