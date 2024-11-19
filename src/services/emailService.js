const baseUrl = "http://localhost:8000";

export const sendEmail = async (subject,message) => {
  // Replace these with actual values or keep them static as placeholders
  let dataSend = {
    // email: "jayasriteki@gmail.com", // Replace with actual email
    email: "dewahov390@nozamas.com", // Replace with actual email
    subject: subject, // Replace with actual subject
    message: message, // Replace with actual message
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
