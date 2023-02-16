import { Typography } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { socketContext } from "../App";
import ChatBox from "../components/ChatBox";

const Room = () => {
  const socket = useContext(socketContext);
  const { id } = useParams();
  useEffect(() => {
    if (!socket) return;
    socket.emit("join-room", { roomId: id });
  }, [id, socket]);
  return (
    <div style={{ marginTop: "20px" }}>
      <Typography sx={{ textAlign: "center" }}>Room ID: {id}</Typography>
      <ChatBox />
    </div>
  );
};

export default Room;
