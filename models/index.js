import mongoose from "mongoose";
import config from "../configs";

const connectDb = () => {
  mongoose.connect(config.MONGO_URI);
  mongoose.connection.on("error", function (err) {
    console.log("Could not connect to MongoDB ", err);
  });
  mongoose.connection.on("connected", function () {
    if (process.env.NODE_ENV !== "production") mongoose.set("debug", true);
    console.log("MongoDB connected! with ", config.MONGO_URI);
  });
  mongoose.connection.on("reconnected", function () {
    console.log("Reconnected to MongoDB");
  });
};
export default connectDb;
