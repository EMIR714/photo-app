import React, { useState } from "react";
import FrontPhoto from "./components/front-photo/FrontPhoto";
import QrScaner from "./components/qr-scaner/QrScaner";
import "./App.css";

function App() {
  const [facingMode, setFacingMode] = useState("user");

  return (
    <div className="combined-app">
      { facingMode === "user" && <FrontPhoto/> }  
      { facingMode === "environment" && <QrScaner/> }
    </div>
  );
}

export default App;

