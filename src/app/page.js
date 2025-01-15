"use client";

import { useEffect, useRef, useState } from "react";

const CameraCapture = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImages, setCapturedImages] = useState([]);

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

      // Get the captured image data as a base64 string
      const imageData = canvasRef.current.toDataURL("image/png");

      // Add the captured image to the array of images
      setCapturedImages((prevImages) => [...prevImages, imageData]);

      // Hide the canvas after capturing the image
      canvasRef.current.style.display = "none";
    }
  };

  return (
    <>
      <div className="h-screen">
        {/* <h1 className="text-center text-2xl font-semibold my-4">
        Evidence capture
      </h1> */}

        <div className="mx-5 mt-5 bg-white border border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            id="player"
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>

        {/* Horizontal Scroll for Captured Images */}
        <div className="flex overflow-x-auto mt-4 py-2 space-x-2.5 px-5">
          {capturedImages.map((image, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-20 h-20 border border-gray-300 rounded-lg overflow-hidden"
            >
              <img
                src={image}
                alt={`Captured ${index}`}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>

        {/* Capture Button */}
        {/* <button
        onClick={captureImage}
        id="capture"
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white font-semibold py-2 px-6 rounded-full shadow-md hover:bg-blue-600"
      >
        Capture
      </button> */}

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
      <button
        onClick={captureImage}
        id="capture"
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white font-semibold py-2 px-6 rounded-full shadow-md hover:bg-blue-600"
      >
        Capture
      </button>
    </>
  );
};

export default CameraCapture;
