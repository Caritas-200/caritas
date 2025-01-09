"use client";

import React, { useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Table from "@/app/components/barangay/Table";
import BeneficiaryModal from "@/app/components/barangay/modal/BeneficiaryForm";
import { BeneficiaryForm } from "@/app/lib/definitions";

// Define the type for the params object returned by useParams
interface Params {
  barangayName: string;
}

const Recipient: React.FC = () => {
  const router = useRouter();
  const params = useParams() as unknown as Params;
  const { barangayName } = params;

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const tableRef = useRef<HTMLDivElement>(null);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (data: BeneficiaryForm) => {
    // Handle form submission here
  };

  return (
    <div className="p-20 bg-gray-700 min-h-screen text-gray-100">
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
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-4">
        List of Beneficiaries in Barangay {barangayName.toUpperCase()}
      </h2>

      {/* Add a ref to this div */}
      <div ref={tableRef}>
        <Table brgyName={barangayName} />
      </div>

      {/* Render the modal conditionally */}
      {isModalOpen && (
        <BeneficiaryModal
          isEditing={false}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          brgyName={barangayName}
        />
      )}
    </div>
  );
};

export default Recipient;
