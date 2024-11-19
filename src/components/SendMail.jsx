// import React from "react";

// const SendMailButton = () => {
//   const baseUrl = "http://localhost:8000";

//   const sendEmail = async () => {
//     // Replace these with actual values or keep them static as placeholders
//     let dataSend = {
//       email: "tekikusuma1622@gmail.com", // Replace with actual email
//       subject: "Test Subject", // Replace with actual subject
//       message: "This is a test message", // Replace with actual message
//     };

//     const res = await fetch(`${baseUrl}/email/sendEmail`, {
//       method: "POST",
//       body: JSON.stringify(dataSend),
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//     });

//     if (res.ok) {
//       alert("Email sent successfully!");
//     } else {
//       alert("Failed to send email.");
//     }
//   };

//   return (
//     <>
//       <div style={styles.container}>
//         <button style={styles.button} onClick={sendEmail}>
//           Send Email
//         </button>
//       </div>
//     </>
//   );
// };

// export default SendMailButton;


// const styles = {
//   container: {
//     display: "flex",
//     justifyContent: "center",
//   },
//   button: {
//     padding: "10px 20px",
//     fontSize: "16px",
//     color: "#fff",
//     backgroundColor: "#007bff",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//     transition: "background-color 0.3s ease",
//   },
// };

// // Button hover effect
// styles.button["hover"] = {
//   backgroundColor: "#0056b3",
// };
