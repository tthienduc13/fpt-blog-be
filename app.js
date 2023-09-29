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
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
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

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FU-BLOG COMMUNITY",
      version: "0.1",
      description:
        "This is the document for API of FU-BLOG COMMUNITY made with Express and documented by Swagger.",
      contact: {
        name: "ducnltdev",
        email: "ducnltdev@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const spacs = swaggerJsdoc(options);
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(spacs));

app.listen(process.env.APP_PORT, () => {
  console.log(`App is listening on ${process.env.APP_PORT}`);
});
