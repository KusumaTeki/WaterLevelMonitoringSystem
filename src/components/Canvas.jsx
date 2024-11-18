import React from "react";
import "../css/style.css";

const Canvas = ({ title, value, unit }) => {
  return (
    <div className="canvasContainer">
      <h3>{title}</h3>
      <p className="valueDisplay">{value} {unit}</p>
    </div>
  );
};

export default Canvas;