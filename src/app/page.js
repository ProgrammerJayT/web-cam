"use client";

import { useEffect, useRef, useState } from "react";

const CameraCapture = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImages, setCapturedImages] = useState([]);
  
  useEffect(() => {
    const constraints = {
      video: { facingMode: "environment" },
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

      // Save the image as a data URL
      const imageData = canvasRef.current.toDataURL("image/png");
      setCapturedImages((prevImages) => [...prevImages, imageData]);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-between items-center p-4 bg-gray-100">
      <div className="flex flex-col items-center flex-grow">
        <h1 className="text-2xl font-semibold mb-4">Capture Image</h1>
        <video
          ref={videoRef}
          autoPlay
          id="player"
          className="w-1/2 mb-4 rounded shadow-lg"
        />
        <canvas
          ref={canvasRef}
          id="canvas"
          width="320"
          height="240"
          className="hidden"
        />
      </div>
      <div className="w-full max-w-4xl overflow-x-auto mb-4 p-2 border border-gray-300 rounded bg-white shadow-sm">
        <div className="flex space-x-4">
          {capturedImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Captured ${index + 1}`}
              className="h-24 w-auto rounded shadow-md"
            />
          ))}
        </div>
      </div>
      <button
        onClick={captureImage}
        id="capture"
        className="mb-8 px-6 py-3 bg-blue-500 text-white font-bold rounded-full shadow-lg hover:bg-blue-600 transition duration-300"
      >
        Capture
      </button>
    </div>
  );
};

export default CameraCapture;
