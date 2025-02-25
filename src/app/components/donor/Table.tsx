import React, { useState, useMemo, ChangeEvent } from "react";
import Swal from "sweetalert2";
import { toSentenceCase } from "@/app/util/toSentenceCase";
import { DonorFormData } from "@/app/lib/definitions";
import DonorInfoModal from "./modal/DonorInfoModal";
import Pagination from "../Pagination";
import { convertFirebaseTimestamp } from "@/app/util/firebaseTimestamp";
import AddDonorModal from "./modal/AddDonorModal";
import { deleteDonor } from "@/app/lib/api/donor/data";

interface DonorTableProps {
  donors: DonorFormData[];
}

const DonorTable: React.FC<DonorTableProps> = ({ donors }) => {
  // Local state for donors
  const [localDonors, setLocalDonors] = useState(donors);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all"); // Filter for status
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDonorInfo, setSelectedDonorInfo] = useState<DonorFormData>();

  // Handle search input
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Filter donors based on search query and status
  const filteredDonors = useMemo(() => {
    let filtered = localDonors.filter(
      (donor) =>
        `${donor.donorName} `
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        donor.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return filtered;
  }, [searchQuery, localDonors]);

  // Pagination logic
  const paginatedDonors = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredDonors.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredDonors, currentPage, itemsPerPage]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredDonors.length / itemsPerPage);

  // Handle donor view
  const handleView = (donor: DonorFormData) => {
    setShowModal((prev) => !prev);
    setSelectedDonorInfo(donor);
  };

  // Handle modal for viewing donor details
  const handleModalViewClose = () => {
    setShowModal((prev) => !prev);
  };

  // Handle modal for viewing donor details
  const handleModalEditClose = () => {
    setShowEditModal((prev) => !prev);
  };

  // Handle delete donor
  const handleEdit = (donor: DonorFormData) => {
    setShowEditModal((prev) => !prev);
    setSelectedDonorInfo(donor);
  };

  // Handle delete donor
  const handleDelete = (donor: DonorFormData) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete ${donor.donorName} ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Logic for deleting the donor
        deleteDonor(donor.id)
          .then(() => {
            // Remove the deleted donor from the local state
            setLocalDonors((prevDonors) =>
              prevDonors.filter((d) => d.id !== donor.id)
            );
            Swal.fire("Deleted!", "The donor has been deleted.", "success");
          })
          .catch((error) => {
            Swal.fire(
              "Error!",
              "There was a problem deleting the donor.",
              "error"
            );
            console.error("Error deleting donor:", error);
          });
      }
    });
  };

  return (
    <div className="bg-white-primary text-text-color p-4 rounded-lg shadow-md min-w-full ">
      <div className="flex flex-col md:flex-row items-center justify-end mb-4 space-y-4 md:space-y-0 md:space-x-4">
        {/* Search Bar */}
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search Donor here..."
          className="p-2 border w-1/2 rounded-lg text-gray-700 outline-none"
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
        <table className="min-w-full bg-white-primary border border-border-color rounded-lg">
          <thead>
            <tr>
              <th className="border border-border-color py-2 px-4 text-left">
                #
              </th>
              <th className="border border-border-color py-2 px-4 text-left">
                Donor Name
              </th>

              <th className="border border-border-color py-2 px-4 text-left">
                Email
              </th>
              <th className="border border-border-color py-2 px-4 text-left">
                Date Added
              </th>
              <th className="border border-border-color py-2 px-4 text-left">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedDonors.length > 0 ? (
              paginatedDonors.map((donor, index) => (
                <tr
                  key={index}
                  className="hover:bg-button-hover-bg-color hover:text-white-primary transition-colors"
                >
                  <td className="border border-border-color py-2 px-4">
                    {index + 1 + (currentPage - 1) * itemsPerPage}
                  </td>
                  <td className="border border-border-color py-2 px-4">
                    {toSentenceCase(donor.donorName)}
                  </td>

                  <td className="border border-border-color py-2 px-4">
                    {donor.email}
                  </td>
                  <td className="border border-border-color py-2 px-4">
                    {convertFirebaseTimestamp(donor?.dateCreated)}
                  </td>
                  <td className="flex gap-2 border border-border-color py-2 px-4">
                    <button
                      onClick={() => handleView(donor)}
                      className="bg-blue-500 text-white px-2 py-1 rounded "
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(donor)}
                      className="bg-green-500 text-white px-2 py-1 rounded "
                    >
                      Edit
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
        <DonorInfoModal
          donor={selectedDonorInfo}
          onClose={handleModalViewClose}
        />
      )}

      {showEditModal && selectedDonorInfo && (
        <AddDonorModal
          onClose={handleModalEditClose}
          initialFormData={selectedDonorInfo}
          isEditing={true}
        />
      )}
    </div>
  );
};

export default DonorTable;
