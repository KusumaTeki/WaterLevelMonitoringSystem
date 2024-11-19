import React, { useState, useEffect, useRef } from "react";
import "./css/style.css";
import "./css/gauge.css";
import WaterLevelGauge from "./components/WaterLevelGauge";
import WaterFlowGauge from "./components/WaterFlowGauge";
import PurityGauge from "./components/PurityGauge";
import MotorControlButton from "./components/MotorControlButton";
import { database } from "./components/firebase";
import { ref, onValue, set } from "firebase/database";
import Canvas from "./components/Canvas";
import { sendEmail } from "./services/emailService";

const App = () => {
  const [sensorData, setSensorData] = useState({
    depth: 4,
    flow: 15,
    purity: 10,
    rate: 0,
    motorStatus: 1,
    safetyLevel: "Safe",
  });

  const maxDepth = 9;
  const maxFlowRate = 30;
  const minTDS = 0;
  const maxTDS = 1000;
  const [lastSentConditions, setLastSentConditions] = useState([]);
  const [isSourceDry, setIsSourceDry] = useState(false);

  const calculateSafetyLevel = (ppm) => {
    if (0 <= ppm && ppm <= 50) return "Pure";
    if (50 <= ppm && ppm <= 150) return "Safe";
    if (150 <= ppm && ppm <= 300) return "Drinkable";
    if (300 <= ppm && ppm <= 600) return "Poor";
    if (600 <= ppm && ppm <= 1000) return "Contaminated";
    return ppm > 1000 ? "Heavily Contaminated" : "Unsafe";
  };

  const roundToTwoDecimals = (value) => parseFloat(value).toFixed(2);

  const waterLevel = maxDepth - sensorData.depth;
  const waterLevelPercentage = waterLevel >= 0 && waterLevel <= maxDepth
    ? Math.min(100, (waterLevel / maxDepth) * 100).toFixed(2)
    : "Sensor Issue";

  const waterFlowPercentage = Math.min(
    100,
    (sensorData.flow * 100) / maxFlowRate
  ).toFixed(2);

  const purityLevelPercentage = Math.max(
    0,
    Math.min(((maxTDS - sensorData.purity) / (maxTDS - minTDS)) * 100, 100)
  ).toFixed(2);

  useEffect(() => {
    const monitorConditions = () => {
      const triggeredConditions = [];

      const controlMotor = (status) => {
        const desiredStatus = status === "on" ? 1 : 0;
        if (sensorData.motorStatus !== desiredStatus) {
          set(ref(database, "main/valve"), desiredStatus);
          console.log(`Motor status set to: ${status}`);
        } else {
          console.log(`Motor already ${status}. No action taken.`);
        }
      };

      if (sensorData.rate === 0 && sensorData.motorStatus === 1) {
        setIsSourceDry(true);
        controlMotor("off");
        triggeredConditions.push(
          "The water source is dry. Motor has been turned off to prevent damage."
        );
      } else {
        setIsSourceDry(false);
      }

      if (waterLevelPercentage >= 90) {
        triggeredConditions.push(
          "Water level is above 90%. The motor will be turned off."
        );
        controlMotor("off");
      } else if (waterLevelPercentage <= 10) {
        triggeredConditions.push(
          "Water level is below 10%. The motor will be turned on."
        );
        controlMotor("on");
      }

      if (waterFlowPercentage <= 10) {
        triggeredConditions.push(
          "Water flow is below 10%. Please check the system."
        );
      }

      if (purityLevelPercentage < 50) {
        triggeredConditions.push(
          "Water purity is below 50%. Please check the water quality."
        );
      }

      const currentConditions = triggeredConditions.join("\n");
      const lastConditions = lastSentConditions.join("\n");

      if (currentConditions && currentConditions !== lastConditions) {
        sendEmail(
          "Alert: Issues Detected in Water Monitoring System",
          currentConditions
        );
        setLastSentConditions(triggeredConditions);
      } else {
        console.log("No new issues detected!");
      }
    };

    monitorConditions();
  }, [sensorData, waterLevelPercentage, waterFlowPercentage, purityLevelPercentage]);

  useEffect(() => {
    const sensorRefs = {
      depth: ref(database, "main/sensor1/value"),
      flow: ref(database, "main/sensor2/value"),
      purity: ref(database, "main/sensor3/value"),
      rate: ref(database, "main/sensor4/value"),
      motorStatus: ref(database, "main/valve"),
    };

    const unsubscribe = Object.keys(sensorRefs).map((key) =>
      onValue(sensorRefs[key], (snapshot) => {
        setSensorData((prev) => ({
          ...prev,
          [key]: key === "purity"
            ? snapshot.val()
            : parseFloat(snapshot.val()),
          safetyLevel: key === "purity"
            ? calculateSafetyLevel(snapshot.val())
            : prev.safetyLevel,
        }));
      })
    );

    return () => unsubscribe.forEach((unsub) => unsub());
  }, []);

  return (
    // <div className="appContainer">
    //   <h1>Water Monitoring System</h1>
    //   <div className="container">
    //     <Canvas title="Water Depth" value={roundToTwoDecimals(waterLevel)} unit="cm" />
    //     <Canvas title="Water Flow Rate" value={roundToTwoDecimals(sensorData.flow)} unit="L/h" />
    //     <Canvas title="Water Purity" value={roundToTwoDecimals(sensorData.purity)} unit="TDS" />
    //   </div>
    //   <p>Source Status: {isSourceDry ? "Dry" : "Normal"}</p>
    //   <div>
    //     <WaterLevelGauge value={waterLevelPercentage} />
    //     <WaterFlowGauge value={waterFlowPercentage} />
    //     <PurityGauge value={purityLevelPercentage} safetyLevel={sensorData.safetyLevel} />
    //     <MotorControlButton motorStatus={sensorData.motorStatus} />
    //   </div>
    // </div>

    <>
//       {/* <div className="appContainer">
//         <h1>Water Monitoring System</h1>
//         <div className="gauge-container">
//           <WaterLevelGauge value={roundToTwoDecimals(sensorData.depth)} />
//           <WaterFlowGauge value={roundToTwoDecimals(sensorData.flow)} />
//           <PurityGauge
//             value={roundToTwoDecimals(sensorData.purity)}
//             safetyLevel={sensorData.safetyLevel}
//           />{" "}
//           <FlowRateGauge value={roundToTwoDecimals(sensorData.rate)} />
//         </div>
//         <MotorControlButton motorStatus={sensorData.motorStatus} />
      </div> */}

      <div className="appContainer">
        <h1>Water Level Monitoring System</h1>
        <div className="container">
          <div className="levelBox">
            <Canvas
              title="Water Depth"
              value={roundToTwoDecimals(waterLevel)}
              unit="cm"
            />
          </div>
          <div className="levelBox">
            <Canvas
              title="Water flowrate"
              value={roundToTwoDecimals(sensorData.flow)}
              unit="LitperHour"
            />
          </div>
          <div className="levelBox">
            <Canvas
              title="Water Quality"
              value={roundToTwoDecimals(sensorData.purity)}
              unit="TDS"
            />
          </div>
        </div>
      </div>

      {/* <p>Source Status: {isSourceDry ? 'Dry' : 'Normal'}</p> */}


      <div className="appContainer">
        {/* <h1>Dashboard</h1> */}
        <div className="container">
          <div className="levelBoxDashboard">
            <h3>Water Level</h3>
            <div>
              {waterLevelPercentage !== "Sensor Issue" ? (
                <div className="gauge">
                  <WaterLevelGauge value={waterLevelPercentage} />
                </div>
              ) : (
                <p className="sensorText">Sensor Issue</p> // Display Sensor Issue text when there's an issue
              )}
            </div>
            {/* <WaterLevelGauge value={waterLevelPercentage} /> */}
            {/* <WaterLevelGauge value={roundToTwoDecimals(sensorData.depth)} /> */}
          </div>
          <div className="levelBoxDashboard">
            <h3>Water Flow</h3>
            <WaterFlowGauge value={waterFlowPercentage} />
            {/* <WaterFlowGauge value={sensorData.flow.toFixed(2)} /> */}
          </div>
          <div className="levelBoxDashboard">
            <h3>Water Purity</h3>
            <PurityGauge
              value={purityLevelPercentage}
              safetyLevel={sensorData.safetyLevel}
            />
          </div>
        </div>
        <MotorControlButton motorStatus={sensorData.motorStatus} />
      </div>
    </>
  );
};

export default App;
