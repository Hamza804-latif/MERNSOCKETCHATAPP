import mongoose from "mongoose";
import { Schema } from "mongoose";

const RoomsSchema = new Schema({
  roomId: String,
  name: String,
});

export default mongoose.model("Rooms", RoomsSchema);
