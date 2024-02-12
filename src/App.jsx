import React, { useState } from "react";
import FrontPhoto from "./components/front-photo/FrontPhoto";
import QrScaner from "./components/qr-scaner/QrScaner";
import "./App.css";

function App() {
  const [cameraEnabled, setCameraEnabled] = useState(false);

  const toggleCamera = () => {
    setCameraEnabled(!cameraEnabled);
  };

  return (
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
  );
}

export default App;
