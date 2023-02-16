import { Button, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { socketContext } from "../App";
import ChatBox from "../components/ChatBox";

const Room = () => {
  const socket = useContext(socketContext);
  const { id } = useParams();
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
    if (!socket) return;
    socket.emit("join-room", { roomId: id });
  }, [id, socket]);

  async function RemoveRoom() {
    socket.emit("room-removed", { roomId: id });
  }
  return (
    <div style={{ marginTop: "20px" }}>
      <Typography sx={{ textAlign: "center" }}>Room ID: {id}</Typography>
      {userId && id && <Button onClick={RemoveRoom}>Delete Room</Button>}
      <ChatBox />
    </div>
  );
};

export default Room;
