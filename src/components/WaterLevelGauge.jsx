// import React, { useState, useEffect } from "react";
// import "../css/WaterLevelGauge.css";
// import { sendEmail } from "./emailService"; // Import the sendEmail function

// const WaterLevelGauge = () => {

//   const [waterLevel, setWaterLevel] = useState(0);
//   const [waterFlowActive, setWaterFlowActive] = useState(true);
//   const [notification, setNotification] = useState({
//     message: "",
//     color: "green",
//   });

//   useEffect(() => {
//     if (waterFlowActive) {
//       const interval = setInterval(simulateWaterLevelChange, 5000);
//       return () => clearInterval(interval);
//     }
//   }, [waterFlowActive]);

//   const simulateWaterLevelChange = () => {
//     const newValue = Math.floor(Math.random() * 60) + 40;

//     if (waterFlowActive) {
//       updateGauge(newValue);

//       if (newValue <= 60) {
//         showNotification(`Water level is at ${newValue}%.`, "green");
//       } else if (newValue > 60 && newValue < 90) {
//         showNotification(
//           `Alert: Water level has exceeded 60%. Current level: ${newValue}%.`,
//           "orange"
//         );
//       }

//       if (newValue >= 90) {
//         showNotification(
//           `Critical: Water level reached ${newValue}%. Automatically stopping water flow.`,
//           "red"
//         );
//         stopWaterFlow();

//         // Send the email when the water level exceeds 90%
//         // sendEmail(
//         //   "Critical Water Level Alert",
//         //   `The water level has exceeded 90%. Current level: ${newValue}%. Automatic flow stoppage has been triggered.`
//         // );
//         sendEmail();
//       }
//     }
//   };

//   const updateGauge = (value) => {
//     setWaterLevel(value);
//   };

//   const showNotification = (message, color) => {
//     setNotification({ message, color });
//   };

//   const stopWaterFlow = () => {
//     setWaterFlowActive(false);
//   };

//   const startWaterFlow = () => {
//     setWaterFlowActive(true);
//   };

//   const toggleWaterFlow = () => {
//     if (waterFlowActive) {
//       stopWaterFlow();
//       showNotification("Water flow has been manually turned off.", "orange");
//     } else {
//       startWaterFlow();
//       showNotification("Water flow has been manually turned on.", "green");
//     }
//   };

//   return (
//     <div className="waterGauge-container">
//       <div className="gauge">
//         <svg className="waterGauge" viewBox="0 0 36 36">
//           <path
//             className="waterGauge-bg"
//             d="M18 2.0845
//               a 15.9155 15.9155 0 0 1 0 31.831
//               a 15.9155 15.9155 0 0 1 0 -31.831"
//           />
//           <path
//             className={`waterGauge-fill ${waterLevel >= 90 ? "critical" : ""}`}
//             strokeDasharray={`${waterLevel}, 100`}
//             d="M18 2.0845
//               a 15.9155 15.9155 0 0 1 0 31.831
//               a 15.9155 15.9155 0 0 1 0 -31.831"
//           />
//           <text
//             x="18"
//             y="20.35"
//             className="waterGauge-percentage"
//             transform="rotate(90 18 18)"
//           >
//             {`${waterLevel}%`}
//           </text>
//         </svg>
//       </div>

//       <div
//         id="notification-bar"
//         className={`notification-bar ${notification.color}`}
//       >
//         {notification.message}
//       </div>
//       <p className="waterGauge-label">Water Level Percentage</p>

//       <button
//         id="toggleButton"
//         onClick={toggleWaterFlow}
//         className={`toggle-button ${waterFlowActive ? "active" : "inactive"}`}
//       >
//         {waterFlowActive ? "Turn Off Water Flow" : "Turn On Water Flow"}
//       </button>
//     </div>
//   );
// };

// export default WaterLevelGauge;

import React, { useEffect, useState } from "react";
import "../css/WaterLevelGauge.css";
import { ref, set, get } from "firebase/database"; // Firebase functions
import { database } from "./firebase"; // Assuming firebase is initialized here
import axios from "axios"; // For making API requests to your backend
import { sendEmail } from "../services/emailService";

const WaterLevelGauge = ({ value }) => {
  // const maxDepth = 10000; // Maximum depth in cm
  const maxDepth = 3700; // Maximum depth in cm
  const levelPercentage = Math.min(100, (value / maxDepth) * 100); // Percentage based on 1000 cm
  const [motorStatus, setMotorStatus] = useState("on"); // To track the motor's status

  const [notification, setNotification] = useState({
        message: "",
        color: "green",
      });

  // Function to update motor status in Firebase
  const updateMotorStatus = async (status) => {
    try {
      const motorRef = ref(database, "main/valve");
      // setNotification("Water level is above 90%", "red");
      await set(motorRef, status); // Update motor control in Firebase
      setMotorStatus(status); // Update local state
    } catch (error) {
      console.error("Error updating motor status in Firebase", error);
    }
  };

  // Monitor water level and adjust motor status
  useEffect(() => {
    const checkMotorStatus = async () => {
      if (levelPercentage >= 90 && motorStatus !== "off") {
        // Turn off the motor
        await updateMotorStatus("off");
        await sendEmail();
        setNotification("Turning off the motor and an email is sent to the user.","red")
      } else if (levelPercentage < 90 && motorStatus !== "on") {
        // Turn the motor back on
        await updateMotorStatus("on");
        setNotification("All good", "green");
      }
    };

    checkMotorStatus();
  }, [levelPercentage, motorStatus]);


  

  return (
    <>
      {/* <div className="gauge">
        <svg className="waterGauge" viewBox="0 0 36 36">
          <path
            className="waterGauge-bg"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className="waterGauge-fill"
            strokeDasharray={`${levelPercentage}, 100`}
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <text
            x="18"
            y="20.35"
            className="waterGauge-percentage"
            transform="rotate(90 18 18)"
          >
            {`${levelPercentage}%`}
          </text>
        </svg>
      </div> */}

      <div className="waterGauge-container">
        <div className="gauge">
          <svg className="waterGauge" viewBox="0 0 36 36">
            <path
              className="waterGauge-bg"
              d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={`waterGauge-fill ${
                levelPercentage >= 90 ? "critical" : ""
              }`}
              strokeDasharray={`${levelPercentage}, 100`}
              d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <text
              x="18"
              y="20.35"
              className="waterGauge-percentage"
              transform="rotate(90 18 18)"
            >
              {`${levelPercentage}%`}
            </text>
          </svg>
        </div>

        <div
          id="notification-bar"
          className={`notification-bar ${notification.color}`}
        >
          {notification.message}
        </div>
        <p className="waterGauge-label">Water Level Percentage</p>

        
      </div>
    </>
  );
};

export default WaterLevelGauge;
