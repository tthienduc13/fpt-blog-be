import nodeMailer from "nodemailer";
import { config as configDotenv } from "dotenv";
import inLineCss from "nodemailer-juice";
configDotenv();

const sendEmail = async (email, mailSubject, content) => {
  try {
    const transport = nodeMailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: "ducnltdev@gmail.com",
        pass: "ficitpurjexensec",
      },
    });
    const mailOption = {
      from: "ducnltdev@gmail.com",
      to: email,
      subject: mailSubject,
      html: content,
    };

    transport.sendMail(mailOption, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Mail sent succesffully:-", info.response);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

export default { sendEmail };
