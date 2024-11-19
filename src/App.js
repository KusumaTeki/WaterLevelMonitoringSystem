import React, { useState, useEffect } from "react";
import "./css/style.css";
import WaterLevelGauge from "./components/WaterLevelGauge";
import WaterFlowGauge from "./components/WaterFlowGauge";
import PurityGauge from "./components/PurityGauge"; // Assuming this displays the purity and safety level
import FlowRateGauge from "./components/FlowRateGauge";
import MotorControlButton from "./components/MotorControlButton";
import { database } from "./components/firebase"; // Firebase import
import { ref, onValue } from "firebase/database";
import Canvas from "./components/Canvas";

const App = () => {
  const [sensorData, setSensorData] = useState({
    depth: 0,
    flow: 0,
    purity: 10, // Initialize with a default value (PPM)
    rate: 0,
    motorStatus: 1,
    safetyLevel: "Safe", // Added safety level state
  });

  // Function to determine safety level based on purity (PPM) values
  const calculateSafetyLevel = (ppm) => {
    if (ppm <= 300) return "Safe";
    if (ppm <= 600) return "Moderate";
    if (ppm <= 1000) return "Poor";
    return "Unsafe";
  };

  // Fetch data from Firebase in real time
  useEffect(() => {
    const sensor1Ref = ref(database, "main/sensor1/value");
    const sensor2Ref = ref(database, "main/sensor2/value");
    const sensor3Ref = ref(database, "main/sensor3/value"); // Purity or TDS values
    const sensor4Ref = ref(database, "main/sensor4/value");
    // const motorRef = ref(database, "main/motor_control");
    const motorRef = ref(database, "main/valve");

    const unsubscribeSensor1 = onValue(sensor1Ref, (snapshot) => {
      setSensorData((prev) => ({ ...prev, depth: snapshot.val() }));
    });
    const unsubscribeSensor2 = onValue(sensor2Ref, (snapshot) => {
      setSensorData((prev) => ({ ...prev, flow: snapshot.val() }));
    });
    const unsubscribeSensor3 = onValue(sensor3Ref, (snapshot) => {
      const purityValue = snapshot.val();
      setSensorData((prev) => {
        const safetyLevel = calculateSafetyLevel(purityValue); // Calculate safety level based on purity
        return { ...prev, purity: purityValue, safetyLevel };
      });
    });
    const unsubscribeSensor4 = onValue(sensor4Ref, (snapshot) => {
      setSensorData((prev) => ({ ...prev, rate: snapshot.val() }));
    });
    const unsubscribeMotor = onValue(motorRef, (snapshot) => {
      setSensorData((prev) => ({ ...prev, motorStatus: snapshot.val() }));
    });

    // Cleanup on unmount
    return () => {
      unsubscribeSensor1();
      unsubscribeSensor2();
      unsubscribeSensor3();
      unsubscribeSensor4();
      unsubscribeMotor();
    };
  }, []);

  // Function to round values to 2 decimals
  const roundToTwoDecimals = (value) => {
    return parseFloat(value).toFixed(2);
  };
  const totalDepth = 9;
  const waterLevel = totalDepth - sensorData.depth;

  return (
    <>
      {/* <div className="appContainer">
        <h1>Water Monitoring System</h1>
        <div className="gauge-container">
          <WaterLevelGauge value={roundToTwoDecimals(sensorData.depth)} />
          <WaterFlowGauge value={roundToTwoDecimals(sensorData.flow)} />
          <PurityGauge
            value={roundToTwoDecimals(sensorData.purity)}
            safetyLevel={sensorData.safetyLevel}
          />{" "}
          <FlowRateGauge value={roundToTwoDecimals(sensorData.rate)} />
        </div>
        <MotorControlButton motorStatus={sensorData.motorStatus} />
      </div> */}

      <div className="appContainer">
         <h1>Water Level Monitoring System</h1>
         <div className="container">
           <div className="levelBox">
             <Canvas title="Water Depth" value={roundToTwoDecimals(waterLevel)} unit="cm" />
           </div>
           <div className="levelBox">
             <Canvas title="Water flowrate" value={roundToTwoDecimals(sensorData.flow)} unit="LitperHour" />
           </div>
           <div className="levelBox">
             <Canvas title="Water Quality" value={roundToTwoDecimals(sensorData.purity)} unit="TDS" />
           </div>
         </div>
       </div>

      <div className="appContainer">
        {/* <h1>Dashboard</h1> */}
        <div className="container">
          <div className="levelBox">
            <h3>Water Level</h3>
            <WaterLevelGauge value={roundToTwoDecimals(waterLevel)} />
            {/* <WaterLevelGauge value={roundToTwoDecimals(sensorData.depth)} /> */}
          </div>
          <div className="levelBox">
            <h3>Water Flow</h3>
            <WaterFlowGauge value={roundToTwoDecimals(sensorData.flow)} />
          </div>
          <div className="levelBox">
            <h3>Water Purity</h3>
            <PurityGauge
              value={roundToTwoDecimals(sensorData.purity)}
              safetyLevel={sensorData.safetyLevel}
            />{" "}
            {/* Pass rounded purity */}
          </div>
          {/* <div className="levelBox">
            <h3>Water Flow Rate</h3>
            <FlowRateGauge value={roundToTwoDecimals(sensorData.rate)} />
          </div> */}
        </div>
          <MotorControlButton motorStatus={sensorData.motorStatus} />
      </div>
    </>
  );
};

export default App;
