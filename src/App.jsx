import React, { useRef, useEffect, useState } from "react";
import FrontPhoto from "./components/front-photo/FrontPhoto";
import QrScaner from "./components/qr-scaner/QrScaner";
import "./App.css";

function App() {
  
  return (
    <div className="combined-app">
      <FrontPhoto/>
      {/* <QrScaner/> */}

    </div>
  );
}

export default App;
