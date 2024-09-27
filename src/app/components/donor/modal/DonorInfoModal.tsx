import React from "react";
import { DonorFormData } from "@/app/lib/definitions";
import { convertFirebaseTimestamp } from "@/app/util/firebaseTimestamp";

interface DonorModalProps {
  donor: DonorFormData;
  onClose: () => void;
}

const DonorInfoModal: React.FC<DonorModalProps> = ({ donor, onClose }) => {
  if (!donor) return null;

  const donorArray = [
    {
      label: "Email",
      value: donor.email,
    },
    {
      label: "Mobile Number",
      value: donor.mobileNumber,
    },
    {
      label: "Gender",
      value: donor.gender,
    },
    {
      label: "Date Created",
      value: convertFirebaseTimestamp(donor?.dateCreated),
    },
    {
      label: "Civil Status",
      value: donor.civilStatus,
    },
    {
      label: "Language",
      value: donor.language,
    },
    {
      label: "Country",
      value: donor.country,
    },
    {
      label: "Religion",
      value: donor.religion,
    },
    {
      label: "Donation Type",
      value: donor.donationType,
    },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white text-gray-700 p-6 rounded-lg w-full max-w-screen-md">
        <div className="flex items-center justify-between border-b border-gray-300 pb-2 mb-4">
          <h2 className="text-xl font-semibold text-gray-700 ">
            Donor Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <h2 className="text-3xl font-semibold mb-4">
          {donor.firstName} {donor.middleName} {donor.lastName} {donor.suffix}
        </h2>

        {donorArray.map((item, index) => (
          <div key={index} className="grid grid-cols-2 mb-3 ">
            <div className="text-gray-700 font-semibold">{item.label}:</div>
            <div className="text-gray-900">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonorInfoModal;
