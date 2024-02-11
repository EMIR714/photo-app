import React, { useRef, useEffect, useState } from "react";
import { ReactComponent as PhotoIcon } from "./photoIcon.svg";
import "./frontPhoto.css";

function FrontPhoto () {
  const [error, setError] = useState();
  const [facing, setFacing] = useState("user");
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const [isEnabled, setEnabled] = useState(true);

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
    console.log(data);
    deletePhoto();
    setFacing(facing === "user" ? "environment" : "user");
  };


  useEffect(() => {
    setError(null);
    stopStream();
    startStream();
  }, [facing]);

  useEffect(() => {
    if (!isEnabled && facing === "environment") {
    }
  }, [isEnabled]);

  return (
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
          <button onClick={() => makePhoto()}>
            <PhotoIcon />
          </button>
        )}
      </div>
    </>
  );
}

export default FrontPhoto;