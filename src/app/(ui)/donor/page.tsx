"use client";

import React, { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import LeftNav from "@/app/components/Nav";
import DonorTable from "@/app/components/donor/Table";
import AddDonorModal from "@/app/components/donor/modal/AddDonorModal";
import { fetchDonors } from "@/app/lib/api/donor/data";
import { DonorFormData } from "@/app/lib/definitions";

const DonorList: React.FC = () => {
  const [showAddDonorModal, setShowAddDonorModal] = useState(false);
  const [donors, setDonors] = useState<DonorFormData[]>([]); // State to hold donor data
  const [loading, setLoading] = useState(true); // State to handle loading

  // Fetch donor data when component mounts
  useEffect(() => {
    const loadDonors = async () => {
      try {
        const donorData = await fetchDonors(); // Fetch donors from Firestore
        setDonors(donorData);
      } catch (error) {
        console.error("Error fetching donors:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    loadDonors();
  }, []);

  const handleOpenModal = () => {
    setShowAddDonorModal(true);
  };

  const handleCloseModal = () => {
    setShowAddDonorModal(false);
  };

  return (
    <div className="h-screen">
      <Header />
      <div className="flex flex-row flex-1 bg-gray-700">
        <LeftNav />
        <div className="bg-gray-700 min-h-screen w-full">
          <div className="flex flex-col px-10 pt-10 gap-4 pb-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">List of Donors</h1>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                onClick={handleOpenModal} // Open the modal on click
              >
                Add Donor
              </button>
            </div>
            {loading ? (
              <p className="text-white">Loading donors...</p>
            ) : (
              <DonorTable donors={donors} />
            )}
          </div>
        </div>
      </div>
      {showAddDonorModal && <AddDonorModal onClose={handleCloseModal} />}
    </div>
  );
};

export default DonorList;