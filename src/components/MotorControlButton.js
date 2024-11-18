import React from "react";
import { database } from "./firebase";
import { ref, set } from "firebase/database";

const MotorControlButton = ({ motorStatus }) => {
  const toggleMotor = () => {
    const newStatus = motorStatus === "off" ? "on" : "off";
    set(ref(database, "main/motor_control"), newStatus);
  };

  return (
    <div>
      <button onClick={toggleMotor}>
        {motorStatus === "off" ? "Turn Motor On" : "Turn Motor Off"}
      </button>
    </div>
  );
};

export default MotorControlButton;
