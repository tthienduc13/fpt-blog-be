// import cron from "node-cron";
// import mailer from "../helpers/sendMail.js";
// cron.schedule("*/10 * * * * *", function () {
//   const subject = "Your password will expired today";
//   const content = `<!DOCTYPE html>
//     <html lang="en">
//     <head>
//       <meta charset="UTF-8">
//       <meta http-equiv="X-UA-Compatible" content="IE=edge">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>Password Expiry Notification</title>
//       <style>
//         body {
//           font-family: 'Arial', sans-serif;
//           background-color: #f4f4f4;
//           color: #333;
//           margin: 0;
//           padding: 0;
//         }

//         .container {
//           max-width: 600px;
//           margin: 20px auto;
//           background-color: #fff;
//           padding: 20px;
//           border-radius: 5px;
//           box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
//         }

//         h1 {
//           color: #007bff;
//         }

//         p {
//           margin-bottom: 15px;
//         }

//         a {
//           color: #007bff;
//           text-decoration: none;
//           font-weight: bold;
//         }
//       </style>
//     </head>
//     <body>
//       <div class="container">
//         <h1>Password Expiry Notification</h1>
//         <p>Your password for DE170123 account of FU Blog Community will expire today. After expiration, you will not be able to login to FU Blog Community until your password is changed.</p>
//         <p>Please visit <a href="https://resetdn.fpt.edu.vn">https://resetdn.fpt.edu.vn</a> to change your password.</p>
//         <p>If you do not know your current password, click <a href="#">here</a> to email a password reset link.</p>
//         <p>Thank you,<br> FU Blog Community Network Administrator</p>
//       </div>
//     </body>
//     </html>
//     `;
//   mailer.sendEmail("ducnltde170123@fpt.edu.vn", subject, content);
//   console.log("Email send every 10 seconds");
// });
