import { Schema, model } from "mongoose";
import { BUYER_ROLE, SELLER_ROLE } from "../utilis/constants";
const userSchema = new Schema({
  username: { type: String, unique: true },
  password: String,
  deposit: Number,
  role: {
    type: String,
    enum: [BUYER_ROLE, SELLER_ROLE],
  },
});

export default model("User", userSchema);
