import React, { useEffect } from "react";
// import React, { useEffect, useState } from "react";
import "../css/WaterLevelGauge.css";
import "../css/style.css";
// import { sendEmail } from "../services/emailService";

const PurityGauge = ({ value, safetyLevel }) => {
  // const [notification, setNotification] = useState({
  //   message: "",
  //   color: "green",
  // });

  // const maxPurity = 150; // Assuming purity is measured as a percentage
  // const levelPercentage = Math.min(100, (value / maxPurity) * 100); // Gauge percentage

  // const minTDS = 0;
  // const maxTDS = 1200;

  // // Calculate purity percentage
  // const levelPercentage = Math.max(
  //   0,
  //   Math.min(((maxTDS - value) / (maxTDS - minTDS)) * 100, 100)
  // ).toFixed(2); // Clamp to [0, 100] and round to 2 decimal places


  // useEffect(() => {
  //   if (value < safetyLevel) {
  //     // setNotification({
  //     //   message: "Water purity is below the safety level!",
  //     //   color: "red",
  //     // });
  //     // sendEmail(
  //     //   "Purity Alert",
  //     //   `Water purity has dropped to ${value}%, which is below the safety level of ${safetyLevel}%.`
  //     // );
  //   } else {
  //     // setNotification({
  //     //   message: "Water purity is within safe limits.",
  //     //   color: "green",
  //     // });
  //   }
  // }, [value, safetyLevel]);

  

  return (
    <>
      <div className="water-level-monitor">
      <div className="gauge">
        <svg viewBox="0 0 36 36" className="circular-chart blue">
           {/* <path
              className="waterGauge-bg"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            /> */}
            {/* <path
              className={`gauge-fill ${
                value < safetyLevel ? "critical" : ""
              }`}
              strokeDasharray={`${value}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            /> */}
            <text x="18" y="20.35" className="percentage">
            {`${safetyLevel}`}
            </text>
            {/* <text x="18" y="20.35" className="percentage">
            {`${value}%`}
            </text> */}
          </svg>
        </div>

       
        <p className="purityGauge-label">Water Purity Percentage</p>
      </div>
    </>
  );
};

export default PurityGauge;

// import React, { useEffect, useState } from "react";
// import "../css/WaterLevelGauge.css";
// import "../css/style.css";
// import { sendEmail } from "../services/emailService";

// const PurityGauge = ({ value, safetyLevel }) => {
//   const [notification, setNotification] = useState({
//     message: "",
//     color: "green",
//   });

//   // const maxPurity = 150; // Assuming purity is measured as a percentage
//   // const levelPercentage = Math.min(100, (value / maxPurity) * 100); // Gauge percentage

//   const minTDS = 0;
//   const maxTDS = 1200;

//   // Calculate purity percentage
//   const levelPercentage = Math.max(
//     0,
//     Math.min(((maxTDS - value) / (maxTDS - minTDS)) * 100, 100)
//   ).toFixed(2); // Clamp to [0, 100] and round to 2 decimal places


//   useEffect(() => {
//     if (value < safetyLevel) {
//       setNotification({
//         message: "Water purity is below the safety level!",
//         color: "red",
//       });
//       // sendEmail(
//       //   "Purity Alert",
//       //   `Water purity has dropped to ${value}%, which is below the safety level of ${safetyLevel}%.`
//       // );
//     } else {
//       setNotification({
//         message: "Water purity is within safe limits.",
//         color: "green",
//       });
//     }
//   }, [value, safetyLevel]);

//   const roundToTwoDecimals = (value) => {
//     return parseFloat(value).toFixed(2); // Ensures two decimals
//   };

//   return (
//     <>
//       <div className="water-level-monitor">
//       <div className="gauge">
//         <svg viewBox="0 0 36 36" className="circular-chart blue">
//            <path
//               className="waterGauge-bg"
//               d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
//             />
//             <path
//               className={`gauge-fill ${
//                 value < safetyLevel ? "critical" : ""
//               }`}
//               strokeDasharray={`${levelPercentage}, 100`}
//               d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
//             />
//             <text x="18" y="20.35" className="percentage">
//             {`${roundToTwoDecimals(levelPercentage)}%`}
//             </text>
//           </svg>
//         </div>

//         {/* <div id="notification-bar" className={`notification-bar ${notification.color}`}>
//           {notification.message}
//         </div> */}
//         <p className="purityGauge-label">Water Purity</p>
//       </div>
//     </>
//   );
// };

// export default PurityGauge;

