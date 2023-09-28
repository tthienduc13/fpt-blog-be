import { db } from "../database/connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { config as configDotenv } from "dotenv";
configDotenv();
export const register = (req, res) => {
  // CHECK IF USER EXISTS
  const q = "SELECT * FROM user WHERE email = ?";
  const user_id = uuidv4();

  db.query(q, [req.body.email], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User already exists!");

    // CREATE A NEW USER
    // Hash the password
    const salt = bcrypt.genSaltSync(11);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    let role;
    const { email } = req.body;
    if (email.endsWith("@fpt.edu.vn")) {
      role = 1;
    } else if (email.endsWith("@fe.edu.vn")) {
      role = 2;
    }

    const insertQuery =
      "INSERT INTO user (user_id, email, password, role_id, isVerified, created_at) VALUES (?,?,?,?,0,NOW())";

    db.query(
      insertQuery,
      [user_id, req.body.email, hashedPassword, role],
      (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("User has been created.");
      }
    );
  });
};

export const login = (req, res) => {
  const q = "SELECT * FROM user WHERE email = ?";
  const rememberStatus = false;
  db.query(q, [req.body.email], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User not found!");

    const checkPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );

    if (!checkPassword) return res.status(400).json("Wrong password or email");

    const token = jwt.sign(
      {
        email: data[0].email,
        sub: data[0].user_id,
        UserRole: data[0].role_id,
        "remember-me": rememberStatus,
      },
      process.env.SECRET_KEY
    );

    res.status(200).json({ token });
  });
};

export const logout = (req, res) => {
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json("User has been logged out");
};

export const getUserInfo = (req, res) => {
  const query = "SELECT * FROM user WHERE user_id = ?";
  db.query(query, [req.body.user_id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0) return res.status(404).json("User not found!");

    const userInfo = result[0];
    res.status(200).json(userInfo);
  });
};
