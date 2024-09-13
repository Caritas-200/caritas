import React, { useState, useMemo, ChangeEvent } from "react";
import Swal from "sweetalert2";
import { toSentenceCase } from "@/app/util/toSentenceCase";
import { DonorFormData } from "@/app/lib/definitions";
import DonorInfoModal from "./modal/DonorInfoModal";
import Pagination from "../Pagination";
import { convertFirebaseTimestamp } from "@/app/util/firebaseTimestamp";

interface DonorTableProps {
  donors: DonorFormData[];
}

const DonorTable: React.FC<DonorTableProps> = ({ donors }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all"); // Filter for status
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [selectedDonorInfo, setSelectedDonorInfo] = useState<DonorFormData>();

  // Handle search input
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Filter donors based on search query and status
  const filteredDonors = useMemo(() => {
    let filtered = donors.filter(
      (donor) =>
        `${donor.firstName} ${donor.lastName}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        donor.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return filtered;
  }, [searchQuery, donors, statusFilter]);

  // Pagination logic
  const paginatedDonors = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredDonors.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredDonors, currentPage, itemsPerPage]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredDonors.length / itemsPerPage);

  // Handle seletect donor info
  const handlesSelectedDonor = (donor: DonorFormData) => {
    setSelectedDonorInfo(donor);
    setShowModal((prev) => !prev);
  };

  // Handle modal for viewing donor details
  const handleViewModal = () => {
    setShowModal((prev) => !prev);
  };

  // Handle delete donor
  const handleDelete = (donor: DonorFormData) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete ${donor.firstName} ${donor.lastName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Logic for deleting the donor
        Swal.fire("Deleted!", "The donor has been deleted.", "success");
      }
    });
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md min-w-full">
      <div className="flex flex-col md:flex-row items-center justify-end mb-4 space-y-4 md:space-y-0 md:space-x-4">
        {/* Search Bar */}
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search Donor here..."
          className="p-2 border w-1/2 rounded-lg text-gray-700"
        />

        {/* Items per page */}
        <select
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          className="p-2 border rounded-lg text-gray-700"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 border border-gray-500 rounded-lg">
          <thead>
            <tr>
              <th className="border-b border-gray-500 py-2 px-4 text-left">
                #
              </th>
              <th className="border-b border-gray-500 py-2 px-4 text-left">
                Last Name
              </th>
              <th className="border-b border-gray-500 py-2 px-4 text-left">
                First Name
              </th>
              <th className="border-b border-gray-500 py-2 px-4 text-left">
                Email
              </th>
              <th className="border-b border-gray-500 py-2 px-4 text-left">
                Date Created
              </th>
              <th className="border-b border-gray-500 py-2 px-4 text-left">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedDonors.length > 0 ? (
              paginatedDonors.map((donor, index) => (
                <tr key={index} className="hover:bg-gray-700 transition-colors">
                  <td className="border-b border-gray-500 py-2 px-4">
                    {index + 1 + (currentPage - 1) * itemsPerPage}
                  </td>
                  <td className="border-b border-gray-500 py-2 px-4">
                    {toSentenceCase(donor.lastName)}
                  </td>
                  <td className="border-b border-gray-500 py-2 px-4">
                    {toSentenceCase(donor.firstName)}
                  </td>
                  <td className="border-b border-gray-500 py-2 px-4">
                    {donor.email}
                  </td>
                  <td className="border-b border-gray-500 py-2 px-4">
                    {convertFirebaseTimestamp(donor?.dateCreated)}
                  </td>
                  <td className="border-b border-gray-500 py-2 px-4">
                    <button
                      onClick={() => handlesSelectedDonor(donor)}
                      className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                    >
                      View Info
                    </button>
                    <button
                      onClick={() => handleDelete(donor)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  No donors found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />

      {showModal && selectedDonorInfo && (
        <DonorInfoModal donor={selectedDonorInfo} onClose={handleViewModal} />
      )}
    </div>
  );
};

export default DonorTable;
