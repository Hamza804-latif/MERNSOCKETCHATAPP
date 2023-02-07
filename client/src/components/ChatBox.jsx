import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Card, Typography } from "@mui/material";

const ChatBox = () => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState();
  const [chat, setChat] = useState([]);
  const [typing, setTyping] = useState(false);
  const [typingTimeOut, setTypingTimeOut] = useState(null);

  useEffect(() => {
    setSocket(io("http://localhost:5000"));
  }, []);
  useEffect(() => {
    if (!socket) return;

    socket.on("message-from-server", (data) => {
      setChat([...chat, { message: data, received: true }]);
      // console.log(chat);
    });
    socket.on("typing-started-server", () => {
      setTyping(true);
      console.log("typing");
    });
    socket.on("typing-ended-server", () => {
      setTyping(false);
    });
  }, [chat, socket]);

  function handleForm(e) {
    e.preventDefault();
    socket.emit("message", message);
    setChat([...chat, { message, received: false }]);
    setMessage("");
  }

  function HandleInput(e) {
    setMessage(e.target.value);
    socket.emit("typing-started");
    if (typingTimeOut) clearTimeout(typingTimeOut);
    setTypingTimeOut(
      setTimeout(() => {
        socket.emit("typing-ended");
      }, 1000)
    );
  }
  return (
    <>
      {typing ? <h3>Typing...</h3> : undefined}
      <Card sx={{ padding: "12px" }}>
        <Box sx={{ marginBottom: "10px", display: "block" }}>
          {chat?.map((data, index) => {
            return (
              <Typography
                sx={{ textAlign: data.received ? "left" : "right" }}
                key={index}
              >
                {data.message}
              </Typography>
            );
          })}
        </Box>
        <Box component="form" onSubmit={handleForm}>
          <TextField
            id="outlined-basic"
            label="Write your message"
            variant="outlined"
            value={message || ""}
            onChange={HandleInput}
          />
          <Button variant="contained" type="submit">
            Send
          </Button>
        </Box>
      </Card>
    </>
  );
};

export default ChatBox;
