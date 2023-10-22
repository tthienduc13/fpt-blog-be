import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config as configDotenv } from "dotenv";
import initRoutes from "./src/routes/index.js";
import http from "http"; // Import thư viện http
import { Server } from "socket.io"; // Import thư viện socket.io
import commentController from "./src/controllers/comment.realtime.js";

configDotenv();
const app = express();
const server = http.createServer(app); // Tạo máy chủ HTTP từ ứng dụng Express
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(
  bodyParser.raw({ inflate: true, limit: "30mb", type: "application/json" })
);
app.use(cors());
app.use(cookieParser());

// Gắn Socket.IO vào ứng dụng Express
commentController(io);

initRoutes(app);

server.listen(process.env.APP_PORT, () => {
  console.log(`App is listening on ${process.env.APP_PORT}`);
});
