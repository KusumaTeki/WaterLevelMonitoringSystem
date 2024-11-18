const expressAsyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
dotenv.config();

let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_MAIL, // generated ethereal user
    pass: process.env.SMTP_PASSWORD, // generated ethereal password
  },
});

const sendEmail = expressAsyncHandler(async (req, res) => {
    const email = "cesadi4378@kazvi.com"
    const subject = "Test Mail after 90%"
    const message = "This is a successful test mail please ignore."
//   const { email, subject, message } = req.body;
console.log(`Sending email to ${email} with subject "${subject}" and message: "${message}"`);

  var mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: subject,
    text: message,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Error sending email: ",error);
      res.status(500).json({message:"Failed to send email."});
    } else {
      console.log("Email sent successfully!");
      res.status(200).json({message:"Email sent successfully!"});
    }
  });
});

module.exports = { sendEmail };
