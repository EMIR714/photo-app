import React, { useRef, useEffect, useState } from "react";
import { ReactComponent as Facingicon } from "./facingIcon.svg";
import { ReactComponent as PhotoIcon } from "./photoIcon.svg";
import { ReactComponent as DeleteIcon } from "./deleteIcon.svg";
import { ReactComponent as DownloadIcon } from "./downloadIcon.svg";
import "./App.css";

function App() {
  const [error, setError] = useState();
  const [isEnabled, setEnabled] = useState(false);
  const [facing, setFacing] = useState("user");
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);

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
  };

  const deletePhoto = () => {
    console.log("delete");
    const context = canvasRef.current.getContext("2d");
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    context.clearRect(0, 0, -canvasRef.current.width, canvasRef.current.height);
  };

  const downloadPhoto = () => {
    const link = document.createElement("a");
    link.download = "photo.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  useEffect(() => {
    setError(null);
    stopStream();
    if (isEnabled) startStream();
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
      <canvas ref={canvasRef}></canvas>
      {error && <div className="error">{error}</div>}
      {isEnabled && <h1>{facing === "user" ? "Front Cam" : "Back Cam"}</h1>}
      <div className="controls">
        <button onClick={() => setEnabled(!isEnabled)}>
          {isEnabled ? "Off" : "ON"}
        </button>
        <button
          onClick={() => setFacing(facing === "user" ? "environment" : "user")}
        >
          <Facingicon />
        </button>
        <button onClick={() => makePhoto()}>
          <PhotoIcon />
        </button>
        <button onClick={() => deletePhoto()}>
          <DeleteIcon />
        </button>
        <button onClick={() => downloadPhoto()}>
          <DownloadIcon />
        </button>
      </div>
    </>
  );
}

export default App;
