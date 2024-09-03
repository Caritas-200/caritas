"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Table from "@/app/components/barangay/Table";
import beneficiaries from "@/app/json/benificiaries.json";

const Recipient: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Handle the case when searchParams might be null
  const barangayName = searchParams
    ? searchParams.get("barangayName") || "Unknown"
    : "Unknown";

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
        <button
          className="bg-green-500 text-white py-2 px-4 rounded-lg"
          onClick={handlePrint}
        >
          Print
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-4">
        List of Beneficiaries in Barangay {barangayName}
      </h2>
      <Table data={beneficiaries} />
      <div className="mt-4">
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-lg"
          // Add functionality to open modal or navigate to another page for adding beneficiaries
        >
          Add New Beneficiary
        </button>
      </div>
    </div>
  );
};

export default Recipient;
