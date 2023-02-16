import { Button, Card } from "@mui/material";
import Box from "@mui/material/Box";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import { socketContext } from "../App";
import Cookies from "js-cookies";

const Header = () => {
  const [rooms, setrooms] = useState([]);
  const navigate = useNavigate();
  const socket = useContext(socketContext);
  const [_userId, setUserId] = useState(null);

  useEffect(() => {
    let userdata = localStorage.getItem("userId");
    if (userdata) setUserId(userdata);
    else setUserId(null);
    GetRooms();
  }, []);

  async function GetRooms() {
    try {
      let data = await fetch("http://localhost:5000/rooms");
      let roomss = await data.json();
      setrooms([...roomss.data]);
    } catch (error) {
      console.log("On Getting Rooms", error.message);
    }
  }

  function CreateRoom() {
    const roomId = v4();
    navigate(`room/${roomId}`);
    socket.emit("new-room-created", { roomId, userId: _userId });
    setrooms([...rooms, { name: "Test", roomId }]);
  }
  function Login() {
    let user = v4();
    localStorage.setItem("userId", user);
    setUserId(localStorage.getItem("userId"));
    navigate("/");
  }
  function Logout() {
    localStorage.removeItem("userId");
    setUserId(null);
    navigate("/");
  }
  useEffect(() => {
    if (!socket) return;
    socket.on("new-room-created", ({ roomId }) => {
      setrooms([...rooms, { name: "Test", roomId }]);
    });

    socket.on("room-removed-server", ({ roomId }) => {
      console.log("emitted");
      setrooms(
        rooms.filter((room) => {
          return room.roomId !== roomId;
        })
      );
      navigate("/");
    });
  }, [navigate, rooms, socket]);
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
        <Box>
          {_userId ? (
            <>
              <Button onClick={CreateRoom}>New Room</Button>
              <Button onClick={Logout}>Logout</Button>
            </>
          ) : (
            <Button onClick={Login}>Login</Button>
          )}
        </Box>
      </Box>
    </Card>
  );
};

export default Header;
