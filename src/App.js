import React, { useState, useEffect, useRef } from "react";
import "./css/style.css";
import "./css/gauge.css";
import WaterLevelGauge from "./components/WaterLevelGauge";
import WaterFlowGauge from "./components/WaterFlowGauge";
import PurityGauge from "./components/PurityGauge"; // Assuming this displays the purity and safety level
// import FlowRateGauge from "./components/FlowRateGauge";
import MotorControlButton from "./components/MotorControlButton";
import { database } from "./components/firebase"; // Firebase import
import { ref, onValue, set } from "firebase/database";
import Canvas from "./components/Canvas";
import { sendEmail } from "./services/emailService";

const App = () => {
  const [sensorData, setSensorData] = useState({
    depth: 4,
    flow: 15,
    purity: 10, // Initialize with a default value (PPM)
    rate: 0,
    motorStatus: 1,
    safetyLevel: "Safe", // Added safety level state
  });

  // Function to determine safety level based on purity (PPM) values
  const calculateSafetyLevel = (ppm) => {
    if (0 <= ppm && ppm <= 50) return "Pure";
    if (50 <= ppm && ppm <= 150) return "Safe";
    if (150 <= ppm && ppm <= 300) return "Drinkable";
    if (300 <= ppm && ppm <= 600) return "Poor";
    if (600 <= ppm && ppm <= 1000) return "Contaminated";
    if (ppm >= 1000) return "Heavily Contaminated";
    return "Unsafe";
  };

  // Function to round values to 2 decimals
  const roundToTwoDecimals = (value) => {
    return parseFloat(value).toFixed(2);
  };
  // const minDepth = 0;
  const maxDepth = 9;
  const waterLevel = maxDepth - sensorData.depth;

  // const waterLevel = sensorData.depth;

  // Check if the sensor value is within the valid range (0 to 9)
  let waterLevelPercentage;
  if (waterLevel >= 0 && waterLevel <= 9) {
    waterLevelPercentage = Math.min(100, (waterLevel / maxDepth) * 100).toFixed(
      2
    );
  } else {
    // Display "Sensor Issue" if the sensor value is out of range
    waterLevelPercentage = "Sensor Issue";
  }

  const maxFlowRate = 30; // Maximum flow rate (arbitrary example)
  const flowLevel = sensorData.flow;
  const waterFlowPercentage = Math.min(
    100,
    (flowLevel * 100) / maxFlowRate
  ).toFixed(2);

  const minTDS = 0;
  const maxTDS = 1000;
  const purityLevel = sensorData.purity;

  // Calculate purity percentage
  const purityLevelPercentage = Math.max(
    0,
    Math.min(((maxTDS - purityLevel) / (maxTDS - minTDS)) * 100, 100)
  ).toFixed(2); // Clamp to [0, 100] and round to 2 decimal places

  const [lastSentConditions, setLastSentConditions] = useState([]);

  const [allDataLoaded, setAllDataLoaded] = useState(false);

  useEffect(() => {
    const dataIsComplete =
      waterLevelPercentage !== undefined &&
      waterFlowPercentage !== undefined &&
      purityLevelPercentage !== undefined;

    setAllDataLoaded(dataIsComplete);
  }, [waterLevelPercentage, waterFlowPercentage, purityLevelPercentage]);

  useEffect(() => {
    if (allDataLoaded) {
      monitorConditions(
        waterLevelPercentage,
        waterFlowPercentage,
        purityLevelPercentage
      );
    } else {
      console.log("Waiting for all sensor data to load...");
    }
  }, [allDataLoaded]);

  useEffect(() => {
    console.log(
      `Motor status updated: ${sensorData.motorStatus ? "On" : "Off"}`
    );
  }, [sensorData.motorStatus]);

  const monitorConditions = (
    waterLevelPercentage,
    waterFlowPercentage,
    purityLevelPercentage
  ) => {
    if (sensorData.motorStatus === 1) {
      console.log("Motor is manually turned ON. Overriding conditions.");
      return; // Skip the condition checks if motor is manually turned on
    }

    console.log("Water Level Percentage:", waterLevelPercentage);
    console.log("Water Flow Percentage:", waterFlowPercentage);
    console.log("Purity Level Percentage:", purityLevelPercentage);

    const controlMotor = (status) => {
      const desiredStatus = status === "on" ? 1 : 0;
      if (sensorData.motorStatus !== desiredStatus) {
        set(ref(database, "main/valve"), desiredStatus);
        console.log(`Motor status set to: ${status}`);
      } else {
        console.log(`Motor already ${status}. No action taken.`);
      }
    };

    const triggeredConditions = [];

    // Water level conditions
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

    // Water flow conditions
    if (waterFlowPercentage >= 90) {
      triggeredConditions.push(
        "Water flow is above 90%. The motor will be turned off."
      );
      controlMotor("off");
    } else if (waterFlowPercentage <= 10) {
      triggeredConditions.push(
        "Water flow is below 10%. Please check the system."
      );
    }

    // Water purity conditions
    if (purityLevelPercentage < 50) {
      triggeredConditions.push(
        "Water purity is below 30%. Please check the water quality."
      );
    }

    // Compare with previously sent conditions
    const currentConditions = triggeredConditions.join("\n");
    const lastConditions = lastSentConditions.join("\n");

    if (currentConditions && currentConditions !== lastConditions) {
      const subject = "Alert: Issues Detected in Water Monitoring System";
      const message = currentConditions;

      // Send email
      sendEmail(subject, message);
      console.log("Email sent with subject:", subject, "and message:", message);

      // Update the last sent conditions
      setLastSentConditions(triggeredConditions);
    } else {
      console.log("No new issues detected!");
    }
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
        console.log("Purity:", purityValue, "Safety Level:", safetyLevel);

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

  const previousSensorData = useRef(sensorData);
  useEffect(() => {
    const hasChanged =
      JSON.stringify(sensorData) !== JSON.stringify(previousSensorData.current);
    if (hasChanged) {
      const waterLevelPercentage = Math.min(
        100,
        ((maxDepth - sensorData.depth) / maxDepth) * 100
      ).toFixed(2);
      const waterFlowPercentage = Math.min(
        100,
        (sensorData.flow * 100) / maxFlowRate
      ).toFixed(2);
      const purityLevelPercentage = Math.max(
        0,
        Math.min(((maxTDS - sensorData.purity) / (maxTDS - minTDS)) * 100, 100)
      ).toFixed(2);

      monitorConditions(
        waterLevelPercentage,
        waterFlowPercentage,
        purityLevelPercentage
      );
      previousSensorData.current = sensorData;
    }
  }, [sensorData]);

  const handleMotorClick = (currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1; // Toggle between 1 (on) and 0 (off)
    setSensorData((prevData) => ({ ...prevData, motorStatus: newStatus }));
    set(ref(database, "main/valve"), newStatus); // Update the motor status in Firebase
  };

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
