import { Schema, model } from "mongoose";

const productSchema = new Schema({
  productName: { type: String, unique: true },
  amountAvaliable: Number,
  cost: Number,
  sellerId: Schema.Types.ObjectId,
});

export default model("Product", productSchema);
