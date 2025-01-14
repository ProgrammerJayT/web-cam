"use client";

import { useEffect, useRef } from "react";

const CameraCapture = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const constraints = {
      video: {
        facingMode: "environment", // Attempt to use the rear camera
      },
    };

    // Access the user's camera
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((error) => {
        console.error("Error accessing camera:", error);
        alert("Unable to access the camera. Please check your permissions.");
      });

    return () => {
      // Cleanup the stream when the component unmounts
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
      <canvas ref={canvasRef} id="canvas" style={{ display: "none" }} />
    </div>
  );
};

export default CameraCapture;
