import React, { useRef, useEffect, useState } from "react";
import { ReactComponent as Facingicon } from "./facingIcon.svg";
import "./App.css";

function App() {
  const [error, setError] = useState();
  const [isEnabled, setEnabled] = useState(false);
  const [facing, setFacing] = useState("user");
  const videoRef = useRef(null);
  const streamRef = useRef(null);

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
      </div>
    </>
  );
}

export default App;
