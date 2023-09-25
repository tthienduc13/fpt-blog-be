import { db } from "../database/connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { config as configDotenv } from "dotenv";
configDotenv();
export const register = (req, res) => {
  //CHECK USER IF EXISTS

  const q = "SELECT * FROM user WHERE email = ?";
  const user_id = uuidv4();
  db.query(q, [req.body.email], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User already exists!");
    // CREATE A NEW USER
    // Hash the password
    const salt = bcrypt.genSaltSync(11);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    const rememberStatus = false;
    const q =
      "INSERT INTO user (user_id,email,password,role, remember) VALUES (?,?,?,?,?)";

    db.query(
      q,
      [
        user_id,
        req.body.email,
        hashedPassword,
        req.body.UserRole,
        rememberStatus,
      ],
      (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("User has been created.");
      }
    );
  });
};

export const login = (req, res) => {
  const q = "SELECT * FROM user WHERE email = ?";

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
        UserRole: data[0].role,
        "remember-me": data[0].remember,
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
