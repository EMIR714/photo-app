import React, { useRef, useEffect, useState, useContext } from "react";
import { ReactComponent as PhotoIcon } from "./photoIcon.svg";
import "./frontPhoto.css";
import QrScaner from "../qr-scaner/QrScaner";
import ScanDataContext from "../ScanDataContext";

function FrontPhoto () {
  const [error, setError] = useState();
  const [facing, setFacing] = useState("user");
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const [isEnabled, setEnabled] = useState(true);
  const [showScanner, setShowScanner] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const { setScanData } = useContext(ScanDataContext);

  const startStream = () => {
    if (facing !== "user") {
      stopStream();
      return;
    }
  
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
    setScanData(prevData => ({ ...prevData, photo: data }));
    deletePhoto();
    stopStream();
    setShowScanner(true);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // радиус Земли в метрах
    const φ1 = lat1 * Math.PI/180; // φ, λ в радианах
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const d = R * c; // в метрах
    return d;
  }

  /* const checkLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation не поддерживается вашим браузером');
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setScanData(prevData => ({ ...prevData, latitude: lat, longitude: lon }));
        const distance = calculateDistance(lat, lon, 42.8476501, 74.5814659);
        if (distance > 200) {
          setLocationError('Вы находитесь далеко от заданной точки');
          setEnabled(false); 
        }
      }, () => {
        setLocationError('Не удалось получить ваше местоположение');
      });
    }
  } */

  useEffect(() => {
   /* checkLocation();*/
    setError(null);
    stopStream();
    startStream();
  }, [facing]);

  return (
    <>
      {locationError && <div className="error">{locationError}</div>}
      {isEnabled && (showScanner ? <QrScaner/> :
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
          <div className="controls">
            {facing === "user" && (
              <>
                <button onClick={() => makePhoto()}>
                  <PhotoIcon />
                </button>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default FrontPhoto;
