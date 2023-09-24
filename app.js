import express from "express";
import bodyParser from "body-parser";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import blogRoutes from "./routes/blog.route.js";
import commentsRoutes from "./routes/comments.route.js";
import likesRoutes from "./routes/likes.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

//middleware
app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(
  bodyParser.raw({ inflate: true, limit: "100kb", type: "application/json" })
);
app.use(cors());
app.use(cookieParser());
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/likes", likesRoutes);

app.listen(3000, () => {
  console.log(`App is listening on 3000`);
});
