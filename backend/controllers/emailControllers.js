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

// Helper function to send emails
const sendEmail = expressAsyncHandler(async (req, res) => {
  const { email, subject, message } = req.body;

  var mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: subject,
    text: message,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Error sending email: ", error);
      res.status(500).json({ message: "Failed to send email." });
    } else {
      console.log("Email sent successfully!");
      res.status(200).json({ message: "Email sent successfully!" });
    }
  });
});

// // Email Case Handlers
// const sendOverflowEmail = async () => {
//   const emailData = {
//     email: "user@example.com", // Replace with actual user email
//     subject: "Water Overflow Alert",
//     message: "The water level has exceeded the 90% mark, and the motor has been turned off to prevent overflow. Please check the water level.",
//   };
//   await sendEmail(emailData);
// };

// const sendUnderflowEmail = async () => {
//   const emailData = {
//     email: "user@example.com", // Replace with actual user email
//     subject: "Water Underflow Alert",
//     message: "The water level has fallen below the threshold, and the motor has been turned on to refill the container. Please monitor the water level.",
//   };
//   await sendEmail(emailData);
// };

// const sendTdsAlertEmail = async (tdsLevel) => {
//   const emailData = {
//     email: "user@example.com", // Replace with actual user email
//     subject: "High TDS Level Alert",
//     message: `The water TDS level has reached ${tdsLevel} ppm. Please check the water quality.`,
//   };
//   await sendEmail(emailData);
// };

// const sendFlowLevelEmail = async (flowLevel) => {
//   const emailData = {
//     email: "user@example.com", // Replace with actual user email
//     subject: "Water Flow Alert",
//     message: `The water flow rate is currently ${flowLevel} L/min. Please check if the flow rate is normal.`,
//   };
//   await sendEmail(emailData);
// };

// const sendDrySourceEmail = async () => {
//   const emailData = {
//     email: "user@example.com", // Replace with actual user email
//     subject: "Water Source Dry Alert",
//     message: "The system has detected no flow of water. Please check the water source and refill it.",
//   };
//   await sendEmail(emailData);
// };

// Exporting handlers
module.exports = {
  sendEmail,
  // sendOverflowEmail,
  // sendUnderflowEmail,
  // sendTdsAlertEmail,
  // sendFlowLevelEmail,
  // sendDrySourceEmail,
};
