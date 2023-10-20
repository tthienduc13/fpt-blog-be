import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config as configDotenv } from "dotenv";
import initRoutes from "./src/routes/index.js";
configDotenv();
const app = express();

//middleware
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

initRoutes(app);

app.listen(process.env.APP_PORT, () => {
  console.log(`App is listening on ${process.env.APP_PORT}`);
});
