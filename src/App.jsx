import React, { useState } from "react";
import FrontPhoto from "./components/front-photo/FrontPhoto";
import "./App.css";
import ScanDataContext from "./components/ScanDataContext";


function App() {
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [scanData, setScanData] = useState(null);
  const toggleCamera = () => {
    setCameraEnabled(!cameraEnabled);
  };

  console.log(scanData)
  return (
    <ScanDataContext.Provider value={{ scanData, setScanData }}>
    <div className="combined-app">
      {!cameraEnabled ? (
        <button onClick={toggleCamera} 
                className="onCamera">
          ВКЛЮЧИТЬ КАМЕРУ
        </button>
      ) : (
        <FrontPhoto />
      )}
    </div>
    </ScanDataContext.Provider>
  );
}

export default App; 
