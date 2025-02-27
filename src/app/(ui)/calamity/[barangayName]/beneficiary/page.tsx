"use client";

import React, { useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Table from "@/app/components/calamity/Table";
import BeneficiaryModal from "@/app/components/calamity/modal/QualifiedBeneficiaryModal";

// Define the type for the params object returned by useParams
interface Params {
  barangayName: string;
}

const Recipient: React.FC = () => {
  const router = useRouter();
  const params = useParams() as unknown as Params;
  const { barangayName } = params;

  const calamityName = barangayName;

  const tableRef = useRef<HTMLDivElement>(null);

  // State to toggle the modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-20 bg-bg-color min-h-screen text-text">
      <div className="flex justify-between items-center mb-4">
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-lg"
          onClick={() => router.back()}
        >
          Back
        </button>
        <button
          className="bg-green-500 text-white py-2 px-4 rounded-lg"
          onClick={() => setIsModalOpen(true)}
        >
          All Qualified Beneficiaries
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-4">
        Calamity Name: {calamityName.toUpperCase()}
      </h2>
      <div ref={tableRef}>
        <Table />
      </div>

      {/* Modal Component */}
      {isModalOpen && (
        <BeneficiaryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          calamityData={{ name: calamityName, calamityType: "Typhoon" }}
        />
      )}
    </div>
  );
};

export default Recipient;
