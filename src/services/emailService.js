const baseUrl = "http://localhost:8000";

export const sendEmail = async () => {
  // Replace these with actual values or keep them static as placeholders
  let dataSend = {
    email: "tekikusuma1622@gmail.com", // Replace with actual email
    subject: "Test Subject", // Replace with actual subject
    message: "This is a test message", // Replace with actual message
    // body: `The water level has exceeded 90% (${value} cm out of ${maxDepth} cm), and the motor has been turned off.`,

  };

  const res = await fetch(`${baseUrl}/email/sendEmail`, {
    method: "POST",
    body: JSON.stringify(dataSend),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (res.ok) {
    alert("Email sent successfully!");
  } else {
    alert("Failed to send email.");
  }
};
