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
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    const hashedEmail = bcrypt.hashSync(req.body.email, salt);
    let role;
    const { email } = req.body;
    if (email.endsWith("@fpt.edu.vn")) {
      role = 0;
    } else if (email.endsWith("@fe.edu.vn")) {
      role = 1;
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
          let content = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
          <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
            <head>
              <meta charset="UTF-8" />
              <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
                integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA=="
                crossorigin="anonymous"
                referrerpolicy="no-referrer"
              />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Document</title>
              <style type="text/css">
                body {
                  height: 100%;
                  margin: 0;
                  background: white;
                }
                table {
                  border-spacing: 0;
                }
                td {
                  padding: 0;
                }
                img {
                  border: 0;
                }
                .wrapper {
                  width: 100%;
                  table-layout: fixed;
                  background-color: #dddd;
                }
                .main {
                  background-color: white;
                  margin: 0 auto;
                  width: 100%;
                  max-width: 600px;
                  border-spacing: 0;
                  font-family: sans-serif;
                  color: #14375f;
                }
                .head-line {
                  height: 12px;
                  background-color: #f27024;
                }
                .header {
                  width: 100%;
                }
                .column {
                  width: 100%;
                  max-width: 600px;
                  vertical-align: top;
                  text-align: center;
                }
                .header-section {
                  padding: 14px 0 4px;
                }          
                .logo-icon {
                  padding-bottom: 10px;
                  text-align: center;
                }          
                .logo-icon img {
                  width: 180px;
                }          
                .social-icon {
                  padding: 4px 72px;
                }         
                .icon {
                  margin-right: 6px;
                  font-size: 30px;
                  color: #0065a9;
                }          
                .banner-section {
                  padding: 30px 0;
                  text-align: center;
                  width: 100%;
                  max-width: 600px;
                  background-color: #0066b2;
                }
                .banner-header {
                  position: relative;
                  width: 100%;
                  height: 100%;
                }
                .banner-h1 {
                  color: white;
                  text-transform: uppercase;
                  letter-spacing: 3px;
                  font-size: 16px;
                  margin-bottom: 8px;
                  font-weight: 600;
                }
                .banner-icon {
                  z-index: 100;
                  width: 48px;
                  height: 48px;
                  color: white;
                  margin-bottom: 12px;
                }
                .banner-header::after {
                  content: "";
                  background-color: #dddd;
                  position: absolute;
                  width: 70px;
                  top: 45%;
                  left: 55%;
                  height: 2px;
                }
                .banner-header::before {
                  content: "";
                  background-color: #dddd;
                  position: absolute;
                  width: 70px;
                  top: 45%;
                  right: 55%;
                  height: 2px;
                }
                .banner-h2 {
                  color: white;
                  font-size: 36px;
                }
                .content-section {
                  padding: 30px 20px;
                  text-align: justify;
                  width: 100%;
                  max-width: 600px;
                  background-color: white;
                  font-weight: 500;
                }
                .content-welcome {
                  text-align: center;
                  width: 100%;
                  max-width: 600px;
                  font-size: 32px;
                }
                .welcome-img {
                  object-fit: cover;
                  height: 150px;
                }
                .content-welcome p {
                  font-size: 36px;
                  font-weight: 600;
                  margin: 0;
                  letter-spacing: 2px;
                }
                .verify-button {
                  text-align: center;
                  width: 100%;
                  max-width: 600px;
                  margin-top: 60px;
                  margin-bottom: 60px;
                }
                .button {
                  font-weight: 600;
                  text-decoration: none;
                  font-size: 20px;
                  color: white;
                  background-color: #0066b2;
                  padding: 15px 30px;
                }
                .button:hover {
                  opacity: 0.7;
                }
                .content2 {
                  margin-bottom: 10px;
                }
                .footer-section {
                  text-align: center;
                  width: 100%;
                  max-width: 600px;
                  background-color: #0db04b33;
                  height: 100px;
                }
                .footer-content {
                  color: #22181c;
                  font-weight: 500;
                }
              </style>
            </head>
          
            <body>
              <center class="wrapper">
                <table class="main">
                  <!-- Top border -->
                  <tr>
                    <td class="head-line"></td>
                  </tr>
                  <!-- Logo section -->
                  <tr>
                    <td class="header-section">
                      <table class="column">
                        <tr>
                          <td class="logo-icon">
                            <a
                              target="_blank"
                              href="#"
                              ><img
                                src="https://res.cloudinary.com/dyu2kc3bl/image/upload/v1696496537/5b67a23a37e0e2bebbf1_1-removebg-preview_n7joud.png"
                                alt="fu-blog"
                            /></a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <!-- Banner section -->
                  <tr>
                    <td class="banner-section">
                    <div class="banner-header">
                    <img
                      class="banner-icon"
                      src="https://res.cloudinary.com/dyu2kc3bl/image/upload/v1696249591/envelope-solid_1_1_r4sn2l.png"
                    ></img>
                  </div>
                      <div class="banner-h1">Thanks for signing with us</div>
                      <div class="banner-h2">Verify Your E-mail Address</div>
                    </td>
                  </tr>
                  <!-- Content section -->
                  <tr>
                    <td class="content-section">
                      <div class="content-welcome">
                        <p>Welcome!</p>
                        <img
                          class="welcome-img"
                          src="https://res.cloudinary.com/dyu2kc3bl/image/upload/v1696247290/handshake_vx8vys.png"
                          alt=""
                        />
                      </div>
                      <div class="content1">
                        Hi ${req.body.email},<br />
                        You are almost set to started in FU-BLOG.We need a little more
                        information to complete your registration, including information
                        of your email. Simply click the button below to verify your email.
                      </div>
                      <div class="verify-button">
                        <a style="color:white;" class="button" href="http://localhost:5000/api/auth/verify?email=${req.body.email}&token=${token}"> Verify email </a>
                      </div>
                      <div class="content2">
                        If that doesn't work, please click <a href="http://localhost:5000/api/auth/verify?email=${req.body.email}&token=${token}">here</a>
                      </div>
                      <div class="content3">
                        Cheers, <br />
                        FU-BLOG
                      </div>
                    </td>
                  </tr>
                  <!-- Footer section -->
                  <tr>
                    <td class="footer-section">
                      <div class="footer-content" style="padding: 0 20px">
                        Block E2a-7, D1 Street Saigon Hi-tech Park, Long Thanh My Ward,
                        District 9, Ho Chi Minh City, Vietnam
                      </div>
                    </td>
                  </tr>
                </table>
              </center>
            </body>
          </html>
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
        firstName: data[0].first_name,
        "remember-me": rememberStatus,
      },
      process.env.SECRET_KEY
    );

    res.status(200).json({ token });
  });
};

const forgotPassword = (req, res) => {
  const query = "SELECT * FROM user where email = ?";
  db.query(query, [req.body.email], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("Email not found");
    const token = jwt.sign(
      { email: data[0].email, user_id: data[0].user_id },
      process.env.SECRET_KEY,
      { expiresIn: "15m" }
    );
    if (!err) {
      let mailSubject = "FUBLOG Community reset password email!";
      let content = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
        <head>
          <meta charset="UTF-8" />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
            integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA=="
            crossorigin="anonymous"
            referrerpolicy="no-referrer"
          />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Document</title>
          <style type="text/css">
            body {
              height: 100%;
              margin: 0;
              background: white;
            }
            table {
              border-spacing: 0;
            }
            td {
              padding: 0;
            }
            img {
              border: 0;
            }
            .wrapper {
              width: 100%;
              table-layout: fixed;
              background-color: #dddd;
            }
            .main {
              background-color: white;
              margin: 0 auto;
              width: 100%;
              max-width: 600px;
              border-spacing: 0;
              font-family: sans-serif;
              color: #14375f;
            }
            .head-line {
              height: 12px;
              background-color: #f27024;
            }
            .header {
              width: 100%;
            }
            .column {
              width: 100%;
              max-width: 600px;
              vertical-align: top;
              text-align: center;
            }
            .header-section {
              padding: 14px 0 4px;
            }          
            .logo-icon {
              padding-bottom: 10px;
              text-align: center;
            }          
            .logo-icon img {
              width: 180px;
            }          
            .social-icon {
              padding: 4px 72px;
            }         
            .icon {
              margin-right: 6px;
              font-size: 30px;
              color: #0065a9;
            }          
            .banner-section {
              padding: 30px 0;
              text-align: center;
              width: 100%;
              max-width: 600px;
              background-color: #0066b2;
            }
            .banner-header {
              position: relative;
              width: 100%;
              height: 100%;
            }
            .banner-h1 {
              color: white;
              text-transform: uppercase;
              letter-spacing: 3px;
              font-size: 16px;
              margin-bottom: 8px;
              font-weight: 600;
            }
            .banner-icon {
              z-index: 100;
              width: 48px;
              height: 48px;
              color: white;
              margin-bottom: 12px;
            }
            .banner-header::after {
              content: "";
              background-color: #dddd;
              position: absolute;
              width: 70px;
              top: 45%;
              left: 55%;
              height: 2px;
            }
            .banner-header::before {
              content: "";
              background-color: #dddd;
              position: absolute;
              width: 70px;
              top: 45%;
              right: 55%;
              height: 2px;
            }
            .banner-h2 {
              color: white;
              font-size: 36px;
            }
            .content-section {
              padding: 30px 20px;
              text-align: justify;
              width: 100%;
              max-width: 600px;
              background-color: white;
              font-weight: 500;
            }
            .content-welcome {
              text-align: center;
              width: 100%;
              max-width: 600px;
              font-size: 32px;
            }
            .welcome-img {
              object-fit: cover;
              height: 150px;
            }
            .content-welcome p {
              font-size: 36px;
              font-weight: 600;
              margin: 0;
              letter-spacing: 2px;
            }
            .verify-button {
              text-align: center;
              width: 100%;
              max-width: 600px;
              margin-top: 60px;
              margin-bottom: 60px;
            }
            .button {
              font-weight: 600;
              text-decoration: none;
              font-size: 20px;
              color: white;
              background-color: #0066b2;
              padding: 15px 30px;
            }
            .button:hover {
              opacity: 0.7;
            }
            .content2 {
              margin-bottom: 10px;
            }
            .footer-section {
              text-align: center;
              width: 100%;
              max-width: 600px;
              background-color: #0db04b33;
              height: 100px;
            }
            .footer-content {
              color: #22181c;
              font-weight: 500;
            }
          </style>
        </head>
      
        <body>
          <center class="wrapper">
            <table class="main">
              <!-- Top border -->
              <tr>
                <td class="head-line"></td>
              </tr>
              <!-- Logo section -->
              <tr>
                <td class="header-section">
                  <table class="column">
                    <tr>
                      <td class="logo-icon">
                        <a
                          target="_blank"
                          href="#"
                          ><img
                            src="https://res.cloudinary.com/dyu2kc3bl/image/upload/v1696496537/5b67a23a37e0e2bebbf1_1-removebg-preview_n7joud.png"
                            alt="fu-blog"
                        /></a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!-- Banner section -->
              <tr>
                <td class="banner-section">
                  <div class="banner-h2">Reset Your Password</div>
                </td>
              </tr>
              <!-- Content section -->
              <tr>
                <td class="content-section">
                  <div class="content1">
                    Hi ${req.body.email},<br />
                    It looks like you forgot your password. Please click the button below to change your password. If you did not request it, please ignore the email.
                  </div>
                  <div class="verify-button">
                    <a style="color:white;" class="button" href="http://localhost:3000/auth/reset-password/${data[0].user_id}/${token}"> Change Password </a>
                  </div>
                  <div class="content2">
                    If that doesn't work, please click <a href="http://localhost:3000/auth/reset-password/${data[0].user_id}/${token}">here</a>
                  </div>
                  <div class="content3">
                    Cheers, <br />
                    FU-BLOG
                  </div>
                </td>
              </tr>
              <!-- Footer section -->
              <tr>
                <td class="footer-section">
                  <div class="footer-content" style="padding: 0 20px">
                    Block E2a-7, D1 Street Saigon Hi-tech Park, Long Thanh My Ward,
                    District 9, Ho Chi Minh City, Vietnam
                  </div>
                </td>
              </tr>
            </table>
          </center>
        </body>
      </html>
      `;
      mailer.sendEmail(req.body.email, mailSubject, content);
      return res.status(200).json("An email sent for reset password");
    }
  });
};

const changePassword = (req, res) => {
  const { user_id, oldPassword, newPassword } = req.body;
  const selectQuery = "SELECT password FROM user WHERE user_id = ?";
  db.query(selectQuery, [user_id], (err, result) => {
    if (err) {
      return res.status(500).json({
        error: "An error occurred while retrieving the user's password.",
      });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }
    const hashedPasswordFromDatabase = result[0].password;
    const passwordMatches = bcrypt.compareSync(
      oldPassword,
      hashedPasswordFromDatabase
    );

    if (!passwordMatches) {
      return res.status(401).json({ error: "Old password does not match." });
    }
    const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
    const updateQuery = "UPDATE user SET password = ? WHERE user_id = ?";
    db.query(updateQuery, [hashedNewPassword, user_id], (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "An error occurred while updating the password." });
      }

      res.status(200).json({ message: "Password updated successfully." });
    });
  });
};

const resetPassword = (req, res) => {
  const { user_id, newPassword } = req.body;

  const selectQuery = "SELECT password FROM user WHERE user_id = ?";
  db.query(selectQuery, [user_id], (err, result) => {
    if (err) {
      return res.status(500).json({
        error: "An error occurred while retrieving the user's password.",
      });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }
    const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
    const updateQuery = "UPDATE user SET password = ? WHERE user_id = ?";
    db.query(updateQuery, [hashedNewPassword, user_id], (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "An error occurred while updating the password." });
      }

      res.status(200).json({ message: "Password updated successfully." });
    });
  });
};
export default {
  login: login,
  register: register,
  verify: verify,
  resetPassword: resetPassword,
  forgotPassword: forgotPassword,
  changePassword: changePassword,
};
