import React, { useContext, useRef } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { Card, Typography } from "@mui/material";
import { socketContext } from "../App";
import { useParams } from "react-router-dom";

const ChatBox = () => {
  const [message, setMessage] = useState();
  const [chat, setChat] = useState([]);
  const [typing, setTyping] = useState(false);
  const [typingTimeOut, setTypingTimeOut] = useState(null);
  const socket = useContext(socketContext);
  const fileref = useRef();

  const { id } = useParams();
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
    socket.on("uploaded", (data) => {
      console.log("data", data);
      setChat([
        ...chat,
        { message: data.buffer, received: true, type: "image" },
      ]);
    });
  }, [chat, socket]);

  function SelectFile() {
    fileref.current.click();
  }

  function UploadFile(e) {
    let file = e.target.files[0];
    if (!file) return;
    let reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      const data = reader.result;
      socket.emit("file-upload", data, { roomId: id });
      setChat([
        ...chat,
        { message: reader.result, received: false, type: "image" },
      ]);
    };
  }

  function handleForm(e) {
    e.preventDefault();
    socket.emit("message", message, id);
    setChat([...chat, { message, received: false }]);
    setMessage("");
  }

  function HandleInput(e) {
    setMessage(e.target.value);
    socket.emit("typing-started", { id });
    if (typingTimeOut) clearTimeout(typingTimeOut);
    setTypingTimeOut(
      setTimeout(() => {
        socket.emit("typing-ended", { id });
      }, 1000)
    );
  }
  return (
    <div style={{ marginTop: "50px" }}>
      {typing ? <h3>Typing...</h3> : undefined}
      <Card sx={{ padding: "12px" }}>
        <Box sx={{ marginBottom: "10px", display: "block" }}>
          {chat?.map((data, index) => {
            return data?.type === "image" ? (
              <img
                src={data?.message}
                alt="imagedata"
                width="200"
                style={{ marginLeft: data.received ? "0" : "500px" }}
              />
            ) : (
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
          <input
            onChange={UploadFile}
            ref={fileref}
            type="file"
            style={{ display: "none" }}
          />
          <Button variant="contained" onClick={SelectFile}>
            Upload File
          </Button>
          <Button variant="contained" type="submit">
            Send
          </Button>
        </Box>
      </Card>
    </div>
  );
};

export default ChatBox;
