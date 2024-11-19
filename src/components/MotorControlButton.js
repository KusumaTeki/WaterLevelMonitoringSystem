import React from "react";
import { database } from "./firebase";
import { ref, set } from "firebase/database";

const MotorControlButton = ({ motorStatus }) => {
  const toggleMotor = () => {
    const newStatus = motorStatus === 0 ? 1 : 0;
    set(ref(database, "main/valve"), newStatus);
  };

  return (
    <div>
      <button className="motor-btn" onClick={toggleMotor}>
        {motorStatus === 0 ? "Turn Motor On" : "Turn Motor Off"}
      </button>
    </div>
  );
};

export default MotorControlButton;

