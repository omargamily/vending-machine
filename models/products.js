import { Schema, model } from "mongoose";

const productSchema = new Schema({
  productName: String,
  amountAvaliable: Number,
  cost: Number,
  sellerId: Schema.Types.ObjectId,
});

export default model("Product", productSchema);
