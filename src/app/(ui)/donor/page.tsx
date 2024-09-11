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
    <div className="h-screen ">
      <Header />
      <div className="flex flex-row flex-1 bg-gray-700">
        <LeftNav />
        <div className=" bg-gray-700 min-h-screen w-full">
          <div className="flex px-10 pt-10 gap-4 pb-6 ">
            <DonorTable donors={donors} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorList;
