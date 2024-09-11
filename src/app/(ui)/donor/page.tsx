"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BeneficiaryForm } from "@/app/lib/definitions";
import Header from "@/app/components/Header";
import LeftNav from "@/app/components/Nav";
import DonorTable from "@/app/components/donor/Table";
import donors from "@/json/donors.json";

const DonorList: React.FC = () => {
  const router = useRouter();

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
    // // Handle form submission here
    // console.log("Submitted data:", data);
    // // You can also update the state or make API calls here
  };

  return (
    <div className="h-screen">
      <Header />
      <div className="flex flex-row flex-1 bg-gray-100">
        <LeftNav />
        <div className="p-24 bg-gray-700 min-h-screen w-full">
          <div className="flex items-center mb-4 justify-end">
            <div className="flex mt-4 gap-4 ">
              {/* <button
                className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                onClick={handleOpenModal}
              >
                Add Donor
              </button> */}
            </div>
            <DonorTable donors={donors} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorList;
