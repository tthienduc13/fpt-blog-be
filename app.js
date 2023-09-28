import express from "express";
import bodyParser from "body-parser";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import blogRoutes from "./routes/blog.route.js";
import commentsRoutes from "./routes/comments.route.js";
import likesRoutes from "./routes/likes.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config as configDotenv } from "dotenv";
configDotenv();
const app = express();

//middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(
  bodyParser.raw({ inflate: true, limit: "100kb", type: "application/json" })
);
app.use(cors({ origin: "http://localhost:3001" }));
app.use(cookieParser());
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/likes", likesRoutes);

app.listen(process.env.APP_PORT, () => {
  console.log(`App is listening on ${process.env.APP_PORT}`);
});
