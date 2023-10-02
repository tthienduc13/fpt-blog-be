import mysql2 from "mysql2";
import { config as configDotenv } from "dotenv";
configDotenv();
// const DB_PORT = 7322;
// const DB_HOST = "containers-us-west-183.railway.app";
// const DB_USER = "root";
// const DB_PASS = "JTtDcNq21OkssQXITafj";
// const MYSQL_DB = "railway";

const DB_PORT = 3306;
const DB_HOST = "localhost";
const DB_USER = "root";
const DB_PASS = "123456";
const MYSQL_DB = "fptblog";

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
