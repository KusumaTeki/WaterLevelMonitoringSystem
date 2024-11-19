// const expressAsyncHandler = require("express-async-handler");
// const dotenv = require("dotenv");
// const nodemailer = require("nodemailer");
// dotenv.config();

// let transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: process.env.SMTP_PORT,
//   secure: false, // true for 465, false for other ports
//   auth: {
//     user: process.env.SMTP_MAIL, // generated ethereal user
//     pass: process.env.SMTP_PASSWORD, // generated ethereal password
//   },
// });

// const sendEmail = expressAsyncHandler(async (req, res) => {
//     const { email, subject, message } = req.body;

//     // const email = "cesadi4378@kazvi.com"
//     // const subject = "Test Mail after 90%"
//     // const message = "This is a successful test mail please ignore."

// console.log(`Sending email to ${email} with subject "${subject}" and message: "${message}"`);

//   var mailOptions = {
//     from: process.env.SMTP_MAIL,
//     to: email,
//     subject: subject,
//     text: message,
//   };

//   transporter.sendMail(mailOptions, function (error, info) {
//     if (error) {
//       console.log("Error sending email: ",error);
//       res.status(500).json({message:"Failed to send email."});
//     } else {
//       console.log("Email sent successfully!");
//       res.status(200).json({message:"Email sent successfully!"});
//     }
//   });
// });

// module.exports = { sendEmail };
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

// Helper function to send a single consolidated email
const sendEmail = expressAsyncHandler(async (req, res) => {
  const { email, subject, message } = req.body;

  // Ensure message is not empty
  if (!message || !message.trim()) {
    return res.status(400).json({ message: "Message cannot be empty." });
  }

  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: subject,
    text: message, // Consolidated message
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ message: "Failed to send email." });
    } else {
      console.log(`Email sent successfully to ${email} with subject "${subject}".`);
      return res.status(200).json({ message: "Email sent successfully!" });
    }
  });
});

// Exporting handlers
module.exports = {
  sendEmail,
};
