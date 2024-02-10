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
  const [qrCodeScanner, setQrCodeScanner] = useState(null);

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
        if (facing === "user") {
          stopQRCodeScanner(); // Остановить сканер при переключении на переднюю камеру
        } else {
          startQRCodeScanner(); // Запустить сканер при переключении на заднюю камеру
        }
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
  };

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
    console.log(data);
    deletePhoto();
    setFacing(facing === "user" ? "environment" : "user");
  };

  const startQRCodeScanner = () => {
    stopStream(); // Остановить видеопоток
    const config = { fps: 10, qrbox: { width: 200, height: 200 } };
    const html5QrCode = new Html5Qrcode("qrCodeContainer");
  
    const qrCodeSuccess = (decodedText) => {
      setQrMessage(decodedText);
      setEnabled(false);
    };
  
    html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccess);
    setQrMessage("");
    setQrCodeScanner(html5QrCode);
  };
  
  const stopQRCodeScanner = () => {
    if (qrCodeScanner) {
      qrCodeScanner.stop().catch((err) => console.error(err));
    }
    startStream(); // Возобновить видеопоток
  };
  
  useEffect(() => {
    setError(null);
    stopStream();
    startStream();
  }, [facing]);

  useEffect(() => {
    if (!isEnabled && facing === "environment") {
      startQRCodeScanner(); // Перезапускаем сканер, если он отключен и используется задняя камера
    }
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
      <canvas id="qrCodeContainer" ref={canvasRef}></canvas>
      {error && <div className="error">{error}</div>}
      <h3>{facing === "user" ? "FRONT CAM" : "BACK CAM"}</h3>
      <div className="controls">
        {facing === "user" && (
          <button onClick={() => makePhoto()}>
            <PhotoIcon />
          </button>
        )}
      </div>
      {facing === "environment" && (
        <div className="scanner">
          {qrMessage && (
            <div className="qr-message">Вы успешно прошли отметку</div>
          )}
        </div>
      )}
    </>
  );
}

export default App;
