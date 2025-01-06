/* eslint-disable react/no-unescaped-entities */
import React from "react";
import Webcam from "react-webcam";
import Image from "next/image";

interface WebcamCaptureProps {
  setIsCameraOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCapturedImage: React.Dispatch<React.SetStateAction<string | null>>;
  capturedImage: string | null;
  isCameraOpen: boolean;
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({
  setIsCameraOpen,
  setCapturedImage,
  capturedImage,
  isCameraOpen,
}) => {
  const webcamRef = React.useRef<Webcam>(null);

  const handleCapture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();

    // Only update state if imageSrc is a valid string
    if (imageSrc) {
      setCapturedImage(imageSrc);
    } else {
      setCapturedImage(null); // or any default value you prefer
    }

    setIsCameraOpen(false);
  };

  return (
    <>
      <div>
        {/* Camera Capture */}
        <div>
          <label htmlFor="capture" className="block text-sm font-medium mb-2">
            Claimant's Picture with Valid ID
          </label>
          <button
            type="button"
            onClick={() => setIsCameraOpen(true)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Capture
          </button>
        </div>

        {capturedImage && (
          <div className="mt-4">
            <Image
              src={capturedImage}
              alt="Captured"
              width={40}
              height={20}
              className="mt-2 w-1/4 h-auto rounded"
            />
          </div>
        )}
      </div>
      {isCameraOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-semibold">Capture Image</h1>
              <button
                onClick={() => setIsCameraOpen(false)}
                className="text-gray-600 text-2xl hover:text-red-500"
              >
                &times;
              </button>
            </div>
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width="100%"
            />
            <div className="mt-4 flex justify-center space-x-2">
              <button
                onClick={handleCapture}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Capture
              </button>
              <button
                onClick={() => setIsCameraOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WebcamCapture;
