import React, { useEffect, useState } from "react";
import "../css/WaterLevelGauge.css";
import "../css/style.css";
import { sendEmail } from "../services/emailService";

const WaterFlowGauge = ({ value }) => {

  const minFlow = 0;
  const maxFlow = 30;
  const flowPercentage = Math.max(
    0,
    Math.min(((value - minFlow) / (maxFlow - minFlow)) * 100, 100)
  ).toFixed(2); // Clamp to range [0, 100] and round to 2 decimal places



  const [motorStatus, setMotorStatus] = useState(0); // Motor status
  const [notification, setNotification] = useState({
    message: "",
    color: "green",
  });

  const maxFlowRate = 30; // Maximum flow rate (arbitrary example)
  const levelPercentage = Math.min(100, (value *100 / maxFlowRate)); // Gauge percentage
  // const levelPercentage = Math.min(100, (value / maxFlowRate) * 100); // Gauge percentage

  // Simulated motor status for this example (can be replaced with real-time monitoring logic)
  useEffect(() => {
    const motor = 1; // Assuming motor is on
    setMotorStatus(motor);

    if (motor === 1 && value === 0) {
      setNotification({ message: "No flow detected! Check water source.", color: "red" });
      sendEmail("Flow Alert", "No water flow detected while motor is running. Please check the source.");
    } else {
      setNotification({ message: "Water flow is normal.", color: "green" });
    }
  }, [value]);

  const roundToTwoDecimals = (value) => {
        return parseFloat(value).toFixed(2); // Ensures two decimals
      };

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
              className={`gauge-fill ${levelPercentage >= 90 ? "critical" : ""}`}
              strokeDasharray={`${levelPercentage}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <text x="18" y="20.35" className="percentage">
            {`${roundToTwoDecimals(levelPercentage)}%`}
            </text>
          </svg>
        </div>

        {/* <div id="notification-bar" className={`notification-bar ${notification.color}`}>
          {notification.message}
        </div> */}
        <p className="waterGauge-label">Water Flow Rate</p>
      </div>
    </>
  );
};

export default WaterFlowGauge;


