const baseUrl = "http://localhost:8000";

export const sendEmail = async (subject, message) => {
  let dataSend = {
    // email: "jayasriteki@gmail.com",
    email: "kolewe7359@kazvi.com",
    subject: subject,
    message: message,
  };
  try {
    const response = await fetch(`${baseUrl}/email/sendEmail`, {
      method: "POST",
      body: JSON.stringify(dataSend),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to send email");
    }
    alert("Issues found Email is sent!!")
    console.log("Email sent successfully");
  } catch (error) {
    console.log(error);
  }
};
