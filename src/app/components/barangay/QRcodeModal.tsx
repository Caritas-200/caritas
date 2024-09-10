import React from "react";
import QRCode from "react-qr-code";

interface QRModalProps {
  qrData: string; // Data to be encoded into the QR code
  onClose: () => void; // Function to close the modal
}

const QRCodeModal: React.FC<QRModalProps> = ({ qrData, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-700"
        >
          ✖
        </button>
        <h2 className="text-2xl font-bold mb-4 pb-4 text-center text-gray-900">
          Beneficiary QR Code
        </h2>
        <div className="flex justify-center mb-4">
          {/* Display the QR code */}
          <QRCode value={qrData} size={200} />
        </div>
        <p className="text-center text-gray-700">
          Scan this QR code to access the beneficiary's details.
        </p>
        <div className="flex justify-center mt-4">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;
