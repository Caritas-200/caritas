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

  const handlePrint = () => {
    if (tableRef.current) {
      const table = tableRef.current.querySelector("table");
      if (!table) return;

      // Clone the table to manipulate for printing
      const clonedTable = table.cloneNode(true) as HTMLTableElement;

      Array.from(clonedTable.rows).forEach((row) => {
        // Remove the last column (example)
        if (row.cells.length > 2) {
          row.deleteCell(row.cells.length - 1);
        }
      });

      // Create the print window
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Print Table</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  margin: 20px;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                }
                table, th, td {
                  border: 1px solid black;
                }
                th, td {
                  padding: 8px;
                  text-align: left;
                }
                /* Add custom print styles if needed */
              </style>
            </head>
            <body>
              ${clonedTable.outerHTML} <!-- Insert the modified table -->
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

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
