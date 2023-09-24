import mysql from "mysql";

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Ibanez131003@",
  database: "fptblog",
});
