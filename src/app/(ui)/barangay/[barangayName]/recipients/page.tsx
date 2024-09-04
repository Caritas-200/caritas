"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Table from "@/app/components/barangay/Table";
import BeneficiaryModal from "@/app/components/barangay/BeneficiaryFormModal";
import beneficiaries from "@/app/json/beneficiaries.json";

// Define the type for the params object returned by useParams
interface Params {
  barangayName: string;
}

interface BeneficiaryForm {
  firstName: string;
  middleName?: string;
  lastName: string;
  mobileNumber: string;
  age: string;
  address: string;
  gender: string;
  work?: string;
  status: string;
  language?: string;
  religion?: string;
  email?: string;
  housingCondition: string[];
  casualty: string[];
  healthCondition: string[];
}

const Recipient: React.FC = () => {
  const router = useRouter();
  const params = useParams() as unknown as Params;
  const { barangayName } = params;

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handlePrint = () => {
    window.print();
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (data: BeneficiaryForm) => {
    // Handle form submission here
    console.log("Submitted data:", data);
    // You can also update the state or make API calls here
  };

  return (
    <div className="p-24 bg-gray-700 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-lg"
          onClick={() => router.back()}
        >
          Back
        </button>
        <div className="flex mt-4 gap-4">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-lg"
            onClick={handleOpenModal} // Open the modal on click
          >
            Add New Beneficiary
          </button>
          <button
            className="bg-green-500 text-white py-2 px-4 rounded-lg"
            onClick={handlePrint}
          >
            Print
          </button>
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-4">
        List of Beneficiaries in Barangay {barangayName.toUpperCase()}
      </h2>
      <Table data={beneficiaries} />

      {/* Render the modal conditionally */}
      {isModalOpen && (
        <BeneficiaryModal onClose={handleCloseModal} onSubmit={handleSubmit} />
      )}
    </div>
  );
};

export default Recipient;
