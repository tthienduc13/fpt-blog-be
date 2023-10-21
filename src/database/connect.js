import mysql2 from "mysql2";
import { config as configDotenv } from "dotenv";
configDotenv();
const DB_PORT = 8040;
const DB_HOST = "containers-us-west-56.railway.app";
const DB_USER = "root";
const DB_PASS = "abwULYGESfU1m6QT03wn";
const MYSQL_DB = "railway";

export const db = mysql2.createConnection({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASS,
  database: MYSQL_DB,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to the database");
});
