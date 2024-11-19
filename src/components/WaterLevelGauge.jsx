// import React, { useEffect, useState } from "react";
// import "../css/WaterLevelGauge.css";
// import "../css/style.css";
// import { ref, set } from "firebase/database"; // Firebase functions
// import { database } from "./firebase"; // Assuming firebase is initialized here
// import { sendEmail } from "../services/emailService";

// const WaterLevelGauge = ({ value }) => {
//   const minDepth = 0;  // Minimum depth in cm (1 cm)
//   const maxDepth = 9;  // Maximum depth in cm (9 cm)
  
//   // Calculate the water level percentage
//   const levelPercentage = Math.min(100, ((value -minDepth)/(maxDepth-minDepth))*100);
//   // const levelPercentage = Math.min(100, ((value - minDepth) / (maxDepth - minDepth)) * 100);

//   const [motorStatus, setMotorStatus] = useState(0); // To track the motor's status
//   const [notification, setNotification] = useState({
//     message: "",
//     color: "green",
//   });

//   // Function to update motor status in Firebase
//   const updateMotorStatus = async (status) => {
//     try {
//       const motorRef = ref(database, "main/valve");
//       await set(motorRef, status); // Update motor control in Firebase
//       setMotorStatus(status); // Update local state
//     } catch (error) {
//       console.error("Error updating motor status in Firebase", error);
//     }
//   };

//   // Monitor water level and adjust motor status
//   useEffect(() => {
//     const checkMotorStatus = async () => {
//       if (value >= maxDepth && motorStatus !== 1) {
//         // Turn off the motor
//         await updateMotorStatus(1);
//         // await sendEmail("Test1","Test2");
//         setNotification("Turning off the motor and an email is sent to the user.", "red");
//       } else if (value < maxDepth && motorStatus !== 0) {
//         // Turn the motor back on
//         await updateMotorStatus(0);
//         setNotification("All good", "green");
//       }
//     };

//     checkMotorStatus();
//   }, [value, motorStatus]);

//   // Function to round the water level to 2 decimal places
//   const roundToTwoDecimals = (value) => {
//     return parseFloat(value).toFixed(2); // Ensures two decimals
//   };

//   return (
//     <>
//       <div className="water-level-monitor">
//       <div className="gauge">
//         <svg viewBox="0 0 36 36" className="circular-chart blue">
//             <path
//               className="waterGauge-bg"
//               d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
//             />
//             <path
//               className={`gauge-fill ${levelPercentage >= 90 ? "critical" : ""}`}
//               strokeDasharray={`${levelPercentage}, 100`}
//               d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
//             />
//             <text
//               x="18"
//               y="20.35"
//               className="percentage"
//               // transform="rotate(90 18 18)"
//             >
//               {/* Use rounded value for display */}
//               {`${roundToTwoDecimals(levelPercentage)}%`}
//             </text>
//           </svg>
//         </div>

//         {/* <div
//           id="notification-bar"
//           className={`notification-bar ${notification.color}`}
//         >
//           {notification.message}
//         </div> */}
//         <p className="waterGauge-label">Water Level Percentage</p>
//       </div>
//     </>
//   );
// };

// export default WaterLevelGauge;



import React, { useEffect, useState } from "react";
import "../css/WaterLevelGauge.css";
import "../css/style.css";
import { ref, set } from "firebase/database"; // Firebase functions
import { database } from "./firebase"; // Assuming firebase is initialized here
// import { sendEmail } from "../services/emailService";

const WaterLevelGauge = ({ value }) => {
  // const minDepth = 0;  // Minimum depth in cm (1 cm)
  const maxDepth = 9;  // Maximum depth in cm (9 cm)
  
  // // Calculate the water level percentage
  // const levelPercentage = Math.min(100, ((value -minDepth)/(maxDepth-minDepth))*100);
  // // const levelPercentage = Math.min(100, ((value - minDepth) / (maxDepth - minDepth)) * 100);

  const [motorStatus, setMotorStatus] = useState(0); // To track the motor's status
  // const [notification, setNotification] = useState({
  //   message: "",
  //   color: "green",
  // });

  // Function to update motor status in Firebase
  const updateMotorStatus = async (status) => {
    try {
      const motorRef = ref(database, "main/valve");
      await set(motorRef, status); // Update motor control in Firebase
      setMotorStatus(status); // Update local state
    } catch (error) {
      console.error("Error updating motor status in Firebase", error);
    }
  };

  // Monitor water level and adjust motor status
  useEffect(() => {
    const checkMotorStatus = async () => {
      if (value >= maxDepth && motorStatus !== 1) {
        // Turn off the motor
        await updateMotorStatus(1);
        // await sendEmail("Test1","Test2");
        // setNotification("Turning off the motor and an email is sent to the user.", "red");
      } else if (value < maxDepth && motorStatus !== 0) {
        // Turn the motor back on
        await updateMotorStatus(0);
        // setNotification("All good", "green");
      }
    };

    checkMotorStatus();
  }, [value, motorStatus]);

  
  return (
    <>
      <div className="water-level-monitor">
      <div className="gauge">
        <svg viewBox="0 0 36 36" className="circular-chart blue">
            <path
              className="waterGauge-bg"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={`gauge-fill ${value >= 90 ? "critical" : ""}`}
              strokeDasharray={`${value}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <text
              x="18"
              y="20.35"
              className="percentage"
              // transform="rotate(90 18 18)"
            >
              {/* Use rounded value for display */}
              {`${value}%`}
            </text>
          </svg>
        </div>

        {/* <div
          id="notification-bar"
          className={`notification-bar ${notification.color}`}
        >
          {notification.message}
        </div> */}
        <p className="waterGauge-label">Water Level Percentage</p>
      </div>
    </>
  );
};

export default WaterLevelGauge;

