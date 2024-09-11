import React from "react";

interface Donor {
  firstName: string;
  lastName: string;
  email: string;
  status: string;
}

interface DonorModalProps {
  donor: Donor | null;
  onClose: () => void;
}

const DonorModal: React.FC<DonorModalProps> = ({ donor, onClose }) => {
  if (!donor) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white text-gray-700 p-6 rounded-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-4">
          Donor Details: {donor.firstName} {donor.lastName}
        </h2>
        <div className="space-y-2">
          <p>
            <strong>Email:</strong> {donor.email}
          </p>
          <p>
            <strong>Status:</strong> {donor.status}
          </p>
          {/* Add other donor details */}
        </div>
        <button
          onClick={onClose}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default DonorModal;
