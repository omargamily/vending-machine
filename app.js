import express from "express";
import helmet from "helmet";
import xss from "xss-clean";
import http from "http";
import cors from "cors";
import morgan from "morgan";
import apiRouter from "./routers/baseRouter";

const SERVER_PORT = process.env.PORT || 3001;

var app = express();
app.use(xss());
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded());
app.use(helmet());
app.use(cors());
app.use("/api", apiRouter);

app.use((error, req, res, next) => {
  res.status(error.status || 500).send(error.message && { err: error.message });
});

var server = http.createServer(app);
server.listen(SERVER_PORT, function () {
  console.log("server listens on port", SERVER_PORT);
});
