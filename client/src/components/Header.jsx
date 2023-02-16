import { Button, Card } from "@mui/material";
import Box from "@mui/material/Box";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import { socketContext } from "../App";

const Header = () => {
  const [rooms, setrooms] = useState([]);
  const navigate = useNavigate();
  const socket = useContext(socketContext);

  useEffect(() => {
    GetRooms();
  }, []);

  async function GetRooms() {
    try {
      let data = await fetch("http://localhost:5000/rooms");
      let roomss = await data.json();
      setrooms([...roomss.data]);
      console.log("rooms", roomss);
    } catch (error) {
      console.log("On Getting Rooms", error.message);
    }
  }

  function CreateRoom() {
    const roomId = v4();
    navigate(`room/${roomId}`);
    socket.emit("new-room-created", { roomId });
    setrooms([...rooms, { name: "Test2", roomId }]);
  }
  useEffect(() => {
    if (!socket) return;
    socket.on("new-room-created", ({ roomId }) => {
      setrooms([...rooms, { name: "Test2", roomId }]);
    });
  }, [rooms, socket]);
  return (
    <Card sx={{ marginTop: "20px", padding: "6px 4px" }} raised>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box>
          <Link to="/">
            <Button>Home</Button>
          </Link>
          {rooms?.map((room, index) => {
            return (
              <Link to={`/room/${room.roomId}`} key={index}>
                <Button>{room.name}</Button>
              </Link>
            );
          })}
        </Box>

        <Button onClick={CreateRoom}>New Room</Button>
      </Box>
    </Card>
  );
};

export default Header;
