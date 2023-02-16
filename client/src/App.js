import "./App.css";

import { Container } from "@mui/system";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Chats from "./pages/Chats";
import Home from "./pages/Home";
import Room from "./pages/Room";
import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

export const socketContext = createContext();

function App() {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    setSocket(io("http://localhost:5000"));
  }, []);

  return (
    <>
      <socketContext.Provider value={socket}>
        <Container>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/room/:id" element={<Room />} />
          </Routes>
        </Container>
      </socketContext.Provider>
    </>
  );
}

export default App;
