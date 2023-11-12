import mysql2 from "mysql2";
import { config as configDotenv } from "dotenv";
configDotenv();
// const DB_PORT = 3306;
// const DB_HOST = "localhost";
// const DB_USER = "root";
// const DB_PASS = "123456";
// const MYSQL_DB = "fptblog";
const DB_PORT = 43974;
const DB_HOST = "monorail.proxy.rlwy.net";
const DB_USER = "root";
const DB_PASS = "gh15F6gbCHH6EaDHDc46EG2bCAH31AAa";
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
// import { config as configDotenv } from "dotenv";
// import { exec } from "child_process";
// configDotenv();

// const DB_PORT = 43974;
// const DB_HOST = "monorail.proxy.rlwy.net";
// const DB_USER = "root";
// const DB_PASS = "gh15F6gbCHH6EaDHDc46EG2bCAH31AAa";
// const MYSQL_DB = "fptblog";

// const connectCommand = `mysql -h${DB_HOST} -u${DB_USER} -p${DB_PASS} --port ${DB_PORT} --protocol=TCP ${MYSQL_DB}`;

// exec(connectCommand, (error, stdout, stderr) => {
//   if (error) {
//     console.error(`Error connecting to database: ${stderr}`);
//   } else {
//     console.log(`Connected to the database:\n${stdout}`);
//   }
// });
