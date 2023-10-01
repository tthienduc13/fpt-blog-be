import { db } from "../database/connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { config as configDotenv } from "dotenv";
import mailer from "../helpers/sendMail.js";
configDotenv();
const register = (req, res) => {
  const q = "SELECT * FROM user WHERE email = ?";
  const user_id = uuidv4();

  db.query(q, [req.body.email], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User already exists!");
    const salt = bcrypt.genSaltSync(11);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    const hashedEmail = bcrypt.hashSync(req.body.email, salt);
    let role;
    const { email } = req.body;
    if (email.endsWith("@fpt.edu.vn")) {
      role = 1;
    } else if (email.endsWith("@fe.edu.vn")) {
      role = 2;
    }

    const insertQuery =
      "INSERT INTO user (user_id, email, password, role_id, isVerified, created_at) VALUES (?,?,?,?,?,NOW())";

    db.query(
      insertQuery,
      [user_id, req.body.email, hashedPassword, role, false],
      (err, data) => {
        if (err) return res.status(500).json(err);
        if (!err) {
          let mailSubject = "FUBLOG Community verification email!";
          const token = hashedEmail;
          let content = `
          <a class="button" href="https://fpt-blog-be-production.up.railway.app/api/auth/verify?email=${req.body.email}&token=${token}">
                  Verify Account
                </a>
          `;
          mailer.sendEmail(req.body.email, mailSubject, content);
          return res.status(200).json("User has been created.");
        }
      }
    );
  });
};

const verify = (req, res) => {
  const email = req.query.email;
  const token = req.query.token;
  if (bcrypt.compareSync(email, token)) {
    db.query(
      "UPDATE user SET isVerified = ? WHERE email = ?",
      [true, email],
      (err, result) => {
        if (err) {
          return res.status(400).send({
            msg: err,
          });
        }
        return res.status(200).json("Account verification successful.");
      }
    );
  } else {
    return res.status(400).json("Invalid verification token.");
  }
};

const login = (req, res) => {
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

    if (!data[0].isVerified) {
      return res
        .status(422)
        .json("Account not verified. Please verify your email.");
    }

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

export default {
  login: login,
  register: register,
  verify: verify,
};
