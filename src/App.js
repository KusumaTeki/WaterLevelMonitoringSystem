// import React, { useState, useEffect } from "react";
// import "./css/style.css";
// import Canvas from "./components/canvas";
// import { database } from "./components/firebase";
// import { ref, onValue } from "firebase/database";
// import WaterLevelGauge from "./components/WaterLevelGauge";
// import WaterQualityGauge from "./components/WaterQualityGauge";
// import { processWaterQuality } from "./components/processWaterQuality";



// const App = () => {
//   const [distance, setDistance] = useState(0);
//   const [volume, setVolume] = useState(0);
//   const [quality, setQuality] = useState(0);
//   const [waterLevel, setWaterLevel] = useState(0); // To store the water level value from Firebase
//   const [tdsValue, setTdsValue] = useState(0);

//   useEffect(() => {
//     const distanceRef = ref(database, "main/sensor1/value");
//     const volumeRef = ref(database, "main/sensor2/value");
//     const qualityRef = ref(database, "main/sensor3/value");
//     const waterLevelRef = ref(database, "main/sensor4/value"); // Assuming sensor4 tracks water level
//     const tdsRef = ref(database, "main/sensor3/value"); // Adjust path based on your Firebase structure
//     const waterQualityRef = ref(database, "waterQuality");



//     const unsubscribeDistance = onValue(distanceRef, (snapshot) => {
//       const value = snapshot.val();
//       setDistance(value ? value.toFixed(2) : "0.00");
//     });

//     const unsubscribeVolume = onValue(volumeRef, (snapshot) => {
//       const value = snapshot.val();
//       setVolume(value ? value.toFixed(2) : "0.00");
//     });

//     const unsubscribeQuality = onValue(qualityRef, (snapshot) => {
//       const value = snapshot.val();
//       setQuality(value ? value.toFixed(2) : "0.00");
//     });

//     const unsubscribeWaterLevel = onValue(waterLevelRef, (snapshot) => {
//       const value = snapshot.val();
//       setWaterLevel(value ? value.toFixed(2) : "0.00");
//     });

//     const unsubscribeTDS = onValue(tdsRef, (snapshot) => {
//       const value = snapshot.val();
//       setTdsValue(value ? value.toFixed(2) : "0.00");
//     });

//     const unsubscribeWaterQuality = onValue(waterQualityRef, (snapshot) => {
//       const data = snapshot.val();
//       if (data) {
//         // Process each link and extract pH and turbidity values
//         const entries = Object.values(data).map((link) => ({
//           pH: link.pH,
//           turbidity: link.turbidity,
//         }));
  
//         processWaterQuality(entries);
//       }
//     });


//     return () => {
//       unsubscribeDistance();
//       unsubscribeVolume();
//       unsubscribeQuality();
//       unsubscribeWaterLevel();
//       unsubscribeTDS();
//       unsubscribeWaterQuality();
//     };
//   }, []);

//   return (
//     <>
//       <div className="appContainer">
//         <h1>Water Level Monitoring System</h1>
//         <div className="container">
//           <div className="levelBox">
//             <Canvas title="Water Depth" value={distance} unit="cm" />
//           </div>
//           <div className="levelBox">
//             <Canvas title="Water flowrate" value={volume} unit="LitperHour" />
//           </div>
//           <div className="levelBox">
//             <Canvas title="Water Quality" value={quality} unit="TDS" />
//           </div>
//         </div>
//       </div>

//       {/* <WaterLevelGauge waterLevel={waterLevel} /> */}

//       <div className="appContainer">
//       {/* <h1>Dashboard</h1> */}
//       <div className="container">
//         <div className="levelBox">
//           <h3>Water Level</h3>
//           <WaterLevelGauge waterLevel={waterLevel} />
//         </div>
//         <div className="levelBox">
//           <h3>Water Quality</h3>
//           {/* <WaterQualityGauge quality={quality} /> */}
//           {/* <WaterQualityGauge tdsValue={tdsValue} /> */}
//         </div>
        
//       </div>
//     </div>

//     </>
//   );
// };

// export default App;


import React, { useState, useEffect } from "react";
import "./css/style.css"
import WaterLevelGauge from "./components/WaterLevelGauge";
import WaterFlowGauge from "./components/WaterFlowGauge";
import PurityGauge from "./components/PurityGauge";
import FlowRateGauge from "./components/FlowRateGauge";
import MotorControlButton from "./components/MotorControlButton";
import { database } from "./components/firebase"; // Firebase import
import { ref, onValue } from "firebase/database";
import Canvas from "./components/Canvas";

const App = () => {
  const [sensorData, setSensorData] = useState({
    depth: 0,
    flow: 0,
    purity: 10,
    rate: 0,
    motorStatus: "off",
  });

  // Fetch data from Firebase in real time
  useEffect(() => {
    const sensor1Ref = ref(database, "main/sensor1/value");
    const sensor2Ref = ref(database, "main/sensor2/value");
    const sensor3Ref = ref(database, "main/sensor3/value");
    const sensor4Ref = ref(database, "main/sensor4/value");
    const motorRef = ref(database, "main/motor_control");

    const unsubscribeSensor1 = onValue(sensor1Ref, (snapshot) => {
      setSensorData((prev) => ({ ...prev, depth: snapshot.val() }));
    });
    const unsubscribeSensor2 = onValue(sensor2Ref, (snapshot) => {
      setSensorData((prev) => ({ ...prev, flow: snapshot.val() }));
    });
    const unsubscribeSensor3 = onValue(sensor3Ref, (snapshot) => {
      setSensorData((prev) => ({ ...prev, purity: snapshot.val() }));
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

  return (
    <>
    <div className="appContainer">      
      <h1>Water Monitoring System</h1>
      <div className="gauge-container">
        <WaterLevelGauge value={sensorData.depth} />
        <WaterFlowGauge value={sensorData.flow} />
        <PurityGauge value={sensorData.purity} />
        <FlowRateGauge value={sensorData.rate} />
      </div>
      <MotorControlButton motorStatus={sensorData.motorStatus} />
    </div>
    
    <div className="appContainer">
         <h1>Water Level Monitoring System</h1>
         <div className="container">
           <div className="levelBox">
             <Canvas title="Water Depth" value={sensorData.depth} unit="cm" />
           </div>
           <div className="levelBox">
             <Canvas title="Water flowrate" value={sensorData.flow} unit="LitperHour" />
           </div>
           <div className="levelBox">
             <Canvas title="Water Quality" value={sensorData.purity} unit="TDS" />
           </div>
         </div>
       </div>
    </>
  );
};

export default App;
