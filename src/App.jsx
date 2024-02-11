import React, { useState } from "react";
import FrontPhoto from "./components/front-photo/FrontPhoto";
import QrScaner from "./components/qr-scaner/QrScaner";
import "./App.css";

function App() {
  const [facingMode, setFacingMode] = useState("user"); // начальное состояние - передняя камера

  // функция для переключения камеры
  const switchCamera = () => {
    setFacingMode(prevMode => prevMode === "user" ? "environment" : "user");
  }

  return (
    <div className="combined-app">
      { facingMode === "user" && <FrontPhoto/> }  
      { facingMode === "environment" && <QrScaner/> }
      <button onClick={switchCamera}>Переключить камеру</button>
    </div>
  );
}

export default App;

