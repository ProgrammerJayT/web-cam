"use client";

import { useEffect, useRef } from "react";

const CameraCapture = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const constraints = {
      video: { facingMode: "environment" }, // Use the rear camera if available
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((error) => {
        if (error.name === "NotAllowedError") {
          alert("Camera access denied. Please enable camera permissions.");
        } else if (error.name === "NotFoundError") {
          alert("No camera found on this device.");
        } else {
          alert("An unexpected error occurred.");
        }
        console.error("Error accessing camera:", error);
      });

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const captureImage = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext("2d");
      const video = videoRef.current;

      canvasRef.current.width = video.videoWidth;
      canvasRef.current.height = video.videoHeight;

      // Draw the video frame to the canvas
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

      // Make the canvas visible to preview the image
      canvasRef.current.style.display = "block";
    }
  };

  return (
    <div>
      <h1>Live Camera Stream</h1>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        id="player"
        style={{ width: "100%" }}
      />
      <button onClick={captureImage} id="capture">
        Capture
      </button>
      <canvas
        ref={canvasRef}
        id="canvas"
        style={{
          display: "none", // Hidden by default
          marginTop: "20px",
          border: "1px solid #ccc",
        }}
      />
    </div>
  );
};

export default CameraCapture;
