import React, { useRef, useEffect, useState } from "react";
import { ReactComponent as PhotoIcon } from "./photoIcon.svg";
import { Html5Qrcode } from "html5-qrcode"; // Импортируйте библиотеку
import "./App.css";

function App() {
  const [error, setError] = useState();
  const [isEnabled, setEnabled] = useState(true);
  const [facing, setFacing] = useState("user");
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const [qrCodeScanner, setQrCodeScanner] = useState(null);
  const [qrCodeLink, setQrCodeLink] = useState(null);

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

  const startQRCodeScanner = () => {
    const scanner = new Html5Qrcode("qr-code-scanner"); // Используйте идентификатор элемента
    scanner.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      (decodedText, decodedResult) => {
        console.log(`Decoded QR Code: ${decodedText}`);
        setQrCodeLink(decodedText); // Сохраните ссылку QR-кода
      },
      (errorMessage) => {
        console.error(`QR Code scanning failed: ${errorMessage}`);
      }
    );
    setQrCodeScanner(scanner); // Сохраните экземпляр сканера
  };

  const stopQRCodeScanner = () => {
    if (qrCodeScanner) {
      qrCodeScanner.stop().catch((err) => console.error(err));
    }
  };

  useEffect(() => {
    setError(null);
    stopStream();
    stopQRCodeScanner(); // Остановите сканер QR-кода
    if (isEnabled) startStream();
    if (facing === "environment") {
      startQRCodeScanner();
    }
  }, [isEnabled, facing]);

  return (
    <>
      <video
        className={facing === "user" ? "mirror" : ""}
        playsInline
        muted
        autoPlay
        ref={videoRef}
      ></video>
      <canvas id="qr-code-scanner" ref={canvasRef}></canvas> {/* Добавьте идентификатор элементу */}
      {error && <div className="error">{error}</div>}
      {isEnabled && <h3>{facing === "user" ? "FRONT CAM" : "BACK CAM"}</h3>}
      <div className="controls">
        {facing === "user" && ( // Отображайте кнопку только при использовании передней камеры
          <button onClick={() => makePhoto()}>
            <PhotoIcon />
          </button>
        )}
      </div>
      {qrCodeLink && <div>Отметка успешно сделана</div>} {/* Отображайте сообщение, когда есть ссылка QR-кода */}
    </>
  );
}

export default App;

