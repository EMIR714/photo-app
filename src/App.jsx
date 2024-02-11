import React, { useState } from "react";
import FrontPhoto from "./components/front-photo/FrontPhoto";
import QrScaner from "./components/qr-scaner/QrScaner";
import "./App.css";

function App() {
  const [facingMode, setFacingMode] = useState("user");

  return (
    <div className="combined-app">
      {facingMode === "user" && <FrontPhoto facingMode={facingMode} setFacingMode={setFacingMode} />}
      {/* {facingMode === "environment" && <QrScaner facingMode={facingMode} />} */}
    </div>
  );
}

export default App;

