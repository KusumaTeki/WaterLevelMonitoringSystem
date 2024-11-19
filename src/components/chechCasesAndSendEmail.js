// import { sendEmail } from "../services/emailService"; // Adjust the import path as necessary

// const checkCasesAndSendEmail = async () => {
//   let triggeredCases = [];

//   // Example case conditions (replace with your actual conditions)
//   let case1 = false; // Replace with real condition
//   let case2 = true;  // Replace with real condition
//   let case3 = true;  // Replace with real condition

//   // Collect messages for triggered cases
//   if (case1) {
//     triggeredCases.push("Case 1: Water level exceeded 90%.");
//   }
//   if (case2) {
//     triggeredCases.push("Case 2: Motor stopped unexpectedly.");
//   }
//   if (case3) {
//     triggeredCases.push("Case 3: Sensor malfunction detected.");
//   }

//   // Send an email if there are any triggered cases
//   if (triggeredCases.length > 0) {
//     const subject = "Alert: Issues Detected";
//     const message = triggeredCases.join("\n"); // Combine messages with line breaks

//     try {
//       await sendEmail(subject, message);
//     } catch (error) {
//       console.error("Failed to send email:", error);
//     }
//   } else {
//     console.log("No issues detected, no email sent.");
//   }
// };

// // Call the function to trigger the check and send the email
// checkCasesAndSendEmail();


// Real-world data (replace these with actual data from sensors, APIs, etc.)
const currentWaterLevel = 95; // Current water level in cm
const maxWaterLevel = 100; // Maximum capacity of the tank in cm
const motorStatus = "stopped"; // Status of the motor (e.g., "running", "stopped")
const sensorHealth = "malfunction"; // Status of the sensor (e.g., "healthy", "malfunction")

// Define cases with real conditions
let case1 = currentWaterLevel > 0.9 * maxWaterLevel; // Water level > 90%
let case2 = motorStatus === "stopped"; // Motor is unexpectedly stopped
let case3 = sensorHealth === "malfunction"; // Sensor reports a malfunction

// Log to check which cases are true
console.log("Case 1:", case1); // Output: true or false
console.log("Case 2:", case2); // Output: true or false
console.log("Case 3:", case3); // Output: true or false

// Collect messages for triggered cases
let triggeredCases = [];
if (case1) triggeredCases.push("Case 1: Water level exceeded 90%.");
if (case2) triggeredCases.push("Case 2: Motor stopped unexpectedly.");
if (case3) triggeredCases.push("Case 3: Sensor malfunction detected.");

// Send email if any case is triggered
if (triggeredCases.length > 0) {
  const subject = "Alert: Issues Detected";
  const message = triggeredCases.join("\n");

  sendEmail(subject, message); // Use your existing sendEmail function
}
