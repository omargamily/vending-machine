import { Schema, model } from "mongoose";

const userSchema = new Schema({
  username: String,
  password: String,
  deposit: Number,
  role: {
    type: String,
    enum: ["buyer", "seller"],
  },
});

export default model("User", userSchema);