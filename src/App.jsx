import React, { useRef, useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { ReactComponent as PhotoIcon } from "./photoIcon.svg";

import "./App.css";

function App() {
  const [photoData, setPhotoData] = useState(null);
  const [facing, setFacing] = useState("user");
  const [isFirstAppEnabled, setFirstAppEnabled] = useState(true);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const html5QrCodeRef = useRef(null);
  const [error, setError] = useState(null);
  const [qrMessage, setQrMessage] = useState("");

  const qrCodeSuccess = (decodedText) => {
    setQrMessage(decodedText);
    setFirstAppEnabled(false);
  };

  const startStream = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: false, video: { facingMode: { exact: facing } } })
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

  // Добавляем вызов startStream при монтировании компонента
  useEffect(() => {
    startStream();
  }, []);

  useEffect(() => {
    setError(null);
    if (!isFirstAppEnabled) {
      stopStream();
      startStream();
    }
  }, [isFirstAppEnabled, facing]);

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

    const data = canvasRef.current.toDataURL("image/png");
    setPhotoData(data);
    setFirstAppEnabled(false);
    setFacing("environment");
    // Добавляем небольшую задержку перед запуском сканера QR-кода, чтобы дать React время на перерисовку
    setTimeout(() => {
      const config = { fps: 10, qrbox: { width: 200, height: 200 } };
      const html5QrCode = new Html5Qrcode("qrCodeContainer");
      html5QrCodeRef.current = html5QrCode;
      html5QrCodeRef.current.start({ facingMode: "environment" }, config, qrCodeSuccess);
    }, 0);
  };

  return (
    <div className="combined-app">
      {isFirstAppEnabled ? (
        <>
          <video
            id="videoContainer"
            className={`camera-video ${facing === "user" ? "mirror" : ""}`}
            playsInline
            muted
            autoPlay
            ref={videoRef}
          ></video>
          <canvas ref={canvasRef}></canvas>
          {error && <div className="error">{error}</div>}
          <h3>{facing === "user" ? "FRONT CAM" : "BACK CAM"}</h3>
          <div className="controls">
            {facing === "user" && (
              <button onClick={makePhoto}>
                <PhotoIcon />
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="scaner">
          <div id="qrCodeContainer">
          {qrMessage && <div className="qr-message">Вы успешно прошли отметку</div>}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
