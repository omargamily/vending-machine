import mongoose from "mongoose";
import config from "../configs";

const connectDb = () => {
  mongoose.connect(config.MONGO_URI);
  mongoose.connection.on("error", function (err) {
    console.log("Could not connect to MongoDB ", err);
  });
  mongoose.connection.on("connected", function () {
    if (!["production", "test"].includes(process.env.NODE_ENV))
      mongoose.set("debug", true);
  });
};
export default connectDb;
