"use client";

import React, { useState } from "react";
import { BeneficiaryForm } from "@/app/lib/definitions";
import Header from "@/app/components/Header";
import LeftNav from "@/app/components/Nav";
import DonorTable from "@/app/components/donor/Table";
import donors from "@/json/donors.json";
import AddDonorModal from "@/app/components/donor/modal/AddDonorModal";

const DonorList: React.FC = () => {
  const [showAddDonorModal, setShowAddDonorModal] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleOpenModal = () => {
    setShowAddDonorModal(true);
  };

  const handleCloseModal = () => {
    setShowAddDonorModal(false);
  };

  const handleSubmit = (data: BeneficiaryForm) => {
    // // Handle form submission here
    // console.log("Submitted data:", data);
    // // You can also update the state or make API calls here
  };

  function onSave(data: any): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="h-screen ">
      <Header />
      <div className="flex flex-row flex-1 bg-gray-700">
        <LeftNav />
        <div className=" bg-gray-700 min-h-screen w-full">
          <div className="flex flex-col px-10 pt-10 gap-4 pb-6 ">
            <div className="flex justify-end">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                onClick={handleOpenModal} // Open the modal on click
              >
                Add Donor
              </button>
            </div>
            <DonorTable donors={donors} />
          </div>
        </div>
      </div>
      {showAddDonorModal && (
        <AddDonorModal onClose={handleCloseModal} onSave={onSave} />
      )}
    </div>
  );
};

export default DonorList;
