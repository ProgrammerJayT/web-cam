"use client";

import { useEffect, useRef, useState } from "react";

const CameraCapture = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImages, setCapturedImages] = useState([]);
  const [description, setDescription] = useState(""); // New state for description

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

      // Add the captured image with its description to the array of images
      setCapturedImages((prevImages) => [
        { image: imageData, description },
        ...prevImages,
      ]);

      // Clear the description after capturing
      setDescription("");

      // Hide the canvas after capturing the image
      canvasRef.current.style.display = "none";
    }
  };

  useEffect(() => {
    console.log("Captured Images", capturedImages);
  }, [capturedImages]);

  return (
    <>
      <div className="h-screen">
        <div className="mx-5 mt-5 bg-white border border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            id="player"
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>

        {/* Description input */}
        <div className="mx-5 mt-5">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)} // Update description as user types
            className="w-full px-3 py-1 border border-gray-300 rounded-lg resize-none"
            rows="5"
            placeholder="Enter description here..."
          ></textarea>
        </div>

        {/* Horizontal Scroll for Captured Images */}
        <div className="flex overflow-x-auto mt-2 py-2 space-x-6 px-5 custom-scroll">
          {capturedImages.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-20 h-20 border border-gray-300 rounded-lg overflow-visible relative"
            >
              <div className="absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                <button
                  onClick={() => {}} // Callback function when SVG is clicked
                  className="p-1 rounded-full bg-white bg-opacity-50 hover:bg-opacity-80 focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="red"
                    className="size-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              <img
                src={item.image}
                alt={`Captured ${index}`}
                className="object-cover w-full h-full"
              />
              {/* Display description below the image */}
              <div className="mt-2 text-center text-sm text-gray-600">
                {item.description}
              </div>
            </div>
          ))}
        </div>

        <div className="flex align-center justify-center my-5 pb-5">
          <button
            onClick={captureImage}
            id="capture"
            className="bg-blue-500 text-white font-semibold mt-5 py-2 px-6 rounded-full shadow-md hover:bg-blue-600"
          >
            Capture
          </button>
        </div>

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
    </>
  );
};

export default CameraCapture;
