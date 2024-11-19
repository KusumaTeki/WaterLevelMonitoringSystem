import React from "react";
import { ref, set } from "firebase/database";
import { database } from "./firebase"; // Import your Firebase database reference


const MotorControlButton = ({ motorStatus }) => {
  const controlMotor = (status) => {
    const newStatus = status === "on" ? 1 : 0;
    set(ref(database, "main/valve"), newStatus); // Change the database reference as needed
    console.log(`Motor status set to: ${status}`);
  };

  const toggleMotor = () => {
    const newStatus = motorStatus === 1 ? "off" : "on";
    controlMotor(newStatus);
  };

  return (
    <button className="motor-btn" onClick={toggleMotor}>
      {motorStatus === 1 ? "Turn Off" : "Turn On"} Motor
    </button>
  );
};

export default MotorControlButton;
