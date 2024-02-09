import React, { useRef, useEffect, useState } from "react";
import { ReactComponent as PhotoIcon } from "./photoIcon.svg";
import { Html5Qrcode } from "html5-qrcode";
import "./App.css";

function App() {
  const [error, setError] = useState();
  const [facing, setFacing] = useState("user");
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const [isEnabled, setEnabled] = useState(true);
  const [qrMessage, setQrMessage] = useState("");
  const [qrCodeScanner, setQrCodeScanner] = useState(null); // Добавлено состояние для qrCodeScanner

  const startStream = () => {
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: {
          facingMode: { exact: facing },
        },
      })
      .then((stream) => {
        streamRef.current = stream;
        videoRef.current.srcObject = streamRef.current;
        videoRef.current.onloadedmetadata = () => videoRef.current.play();
      })
      .catch((err) => {
        setError(err.name);
      });
  };

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  const deletePhoto = () => {
    const context = canvasRef.current.getContext("2d");
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    context.clearRect(0, 0, -canvasRef.current.width, canvasRef.current.height);
  }

  const makePhoto = () => {
    const videoWidth = videoRef.current.scrollWidth;
    const videoHeight = videoRef.current.scrollHeight;
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;
    if (facing === "user") {
      const context = canvasRef.current.getContext("2d");
      context.scale(-1, 1);
      context.drawImage(videoRef.current, 0, 0, -videoWidth, videoHeight);
    } else {
      canvasRef.current
        .getContext("2d")
        .drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);
    }
  
    // Сохранение фото в data
    const data = canvasRef.current.toDataURL("image/png");
    console.log(data); // здесь вы можете использовать data как вам угодно
    deletePhoto();
    // Переключение камеры
    setFacing(facing === "user" ? "environment" : "user");
  };

  const stopQRCodeScanner = () => {
    if (qrCodeScanner) {
      qrCodeScanner.stop().catch((err) => console.error(err));
    }
  };

  useEffect(() => {
    setError(null);
    stopStream(); 
    startStream();
  }, [facing]);

  useEffect(() => {
    const config = { fps: 10, qrbox: { width: 200, height: 200 } };

    const html5QrCode = new Html5Qrcode("qrCodeContainer");

    const qrScanerStop = () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode
          .stop()
          .then((ignore) => console.log("Scaner stop"))
          .catch((err) => console.log("Scaner error"));
      }
    };

    const qrCodeSuccess = (decodedText) => {
      setQrMessage(decodedText);
      setEnabled(false);
    };

    if (isEnabled) {
      html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccess);
      setQrMessage("");
      setQrCodeScanner(html5QrCode); // Установка qrCodeScanner после запуска сканера
    } else {
      qrScanerStop();
    }

    return () => {
      qrScanerStop();
    };
  }, [isEnabled]);

  return (
    <>
      <video
  className={`camera-video ${facing === "user" ? "mirror" : ""}`}
  playsInline
  muted
  autoPlay
  ref={videoRef}
></video>
      <canvas id="qrCodeContainer" ref={canvasRef} ></canvas> 
      {error && <div className="error">{error}</div>}
      <h3>{facing === "user" ? "FRONT CAM" : "BACK CAM"}</h3>
      <div className="controls">
        {facing === "user" && <button onClick={() => makePhoto()}><PhotoIcon /></button>}
      </div>
      {facing === "environment" && <div className="scaner">
        <div id="qrCodeContainer" />
        {qrMessage && <div className="qr-message">Вы успешно прошли отметку</div>}
      </div>}
    </>
  );
}

export default App;
