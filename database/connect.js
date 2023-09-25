import mysql from "mysql";
import { config as configDotenv } from "dotenv";
configDotenv();
export const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.MYSQL_DB,
});
