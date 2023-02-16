import { Router } from "express";
import RoomsSchema from "../models/Room.js";

const router = new Router();

router.get("/rooms", async (req, resp) => {
  try {
    let rooms = await RoomsSchema.find();
    if (rooms) {
      resp.status(200).json({ status: 200, data: rooms });
    } else {
      resp.status(404).json({ status: 404, message: "No Data Found" });
    }
  } catch (error) {
    console.log("error in Routes /rooms", err);
  }
});

export default router;
