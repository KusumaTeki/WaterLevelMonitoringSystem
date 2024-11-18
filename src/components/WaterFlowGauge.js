import React from "react";
import "../css/gauge.css";

const WaterFlowGauge = ({ value }) => {
  return (
    <div className="gauge">
      <svg className="waterGauge" viewBox="0 0 36 36">
        <path
          className="waterGauge-bg"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          className="waterGauge-fill"
          strokeDasharray={`${Math.min(value, 100)}, 100`}
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <text
          x="18"
          y="20.35"
          className="waterGauge-percentage"
          transform="rotate(90 18 18)"
        >
          {`${value} L`}
        </text>
      </svg>
    </div>
  );
};

export default WaterFlowGauge;
