import React from "react";
import "../css/Purity.css"; // Use same CSS for simplicity
import "../css/style.css"

const WaterFlowGauge = ({ flowRate }) => {
  // Ensure flowRate is within range 1-30
  const getFlowRatePercentage = () => {
    return Math.min(Math.max(flowRate, 1), 30) / 30 * 100;
  };

  return (
    <div className="waterFlowGauge-container">
      <div className="gauge">
        <svg className="waterFlowGauge" viewBox="0 0 36 36">
          <path
            className="waterFlowGauge-bg"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className="waterFlowGauge-fill"
            strokeDasharray={`${getFlowRatePercentage()}, 100`}
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <text
            x="18"
            y="20.35"
            className="waterFlowGauge-percentage"
            transform="rotate(90 18 18)"
          >
            {`${Math.min(Math.max(flowRate, 1), 30)} L/min`}
          </text>
        </svg>
      </div>
      <p className="waterFlowGauge-label">Water Flow Rate</p>
    </div>
  );
};

export default WaterFlowGauge;
