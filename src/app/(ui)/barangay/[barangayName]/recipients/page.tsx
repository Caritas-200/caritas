"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import Table from "@/app/components/barangay/Table";
import beneficiaries from "@/app/json/benificiaries.json";

// Define the type for the params object returned by useParams
interface Params {
  barangayName: string;
}

const Recipient: React.FC = () => {
  const router = useRouter();
  const params = useParams() as unknown as Params;
  const { barangayName } = params;

  // Dummy data for the table
  const handlePrint = () => {
    window.print();
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
            // Add functionality to open modal or navigate to another page for adding beneficiaries
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
    </div>
  );
};

export default Recipient;
