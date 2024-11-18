import React, { useEffect, useState } from "react";
import "../css/Purity.css"; // Custom CSS for purity gauge

const PurityGauge = ({ ppmValue }) => {
  const [purityStatus, setPurityStatus] = useState("Excellent");
  const [notification, setNotification] = useState({ message: "", color: "green" });

  // Determine water purity status based on PPM
  const getPurityStatus = (ppm) => {
    if (ppm <= 50) {
      return { status: "Excellent", color: "green" };
    } else if (ppm <= 100) {
      return { status: "Good", color: "lightgreen" };
    } else if (ppm <= 200) {
      return { status: "Average", color: "yellow" };
    } else if (ppm <= 400) {
      return { status: "Poor", color: "orange" };
    } else {
      return { status: "Very Poor", color: "red" };
    }
  };

  // Update purity status and notification based on PPM
  useEffect(() => {
    const { status, color } = getPurityStatus(ppmValue);
    setPurityStatus(status);
    setNotification({ message: `Water Purity: ${status}`, color: color });
  }, [ppmValue]);

  // Function to display the purity level percentage
  const getPurityPercentage = () => {
    if (ppmValue <= 50) return 100;
    if (ppmValue <= 100) return 80;
    if (ppmValue <= 200) return 60;
    if (ppmValue <= 400) return 40;
    return 20;
  };

  return (
    <div className="purityGauge-container">
      <div className="gauge">
        <svg className="purityGauge" viewBox="0 0 36 36">
          <path
            className="purityGauge-bg"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className={`purityGauge-fill ${notification.color}`}
            strokeDasharray={`${getPurityPercentage()}, 100`}
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <text
            x="18"
            y="20.35"
            className="purityGauge-percentage"
            transform="rotate(90 18 18)"
          >
            {`${getPurityPercentage()}%`}
          </text>
        </svg>
      </div>

      <div id="notification-bar" className={`notification-bar ${notification.color}`}>
        {notification.message}
      </div>

      <p className="purityGauge-label">Water Purity Level</p>
    </div>
  );
};

export default PurityGauge;
