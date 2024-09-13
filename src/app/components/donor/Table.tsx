import React, { useState, useMemo, ChangeEvent } from "react";
import Swal from "sweetalert2";
import { toSentenceCase } from "@/app/util/toSentenceCase";

interface Donor {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
}

interface DonorTableProps {
  donors: Donor[];
}

const DonorTable: React.FC<DonorTableProps> = ({ donors }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all"); // Filter for status
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);

  // Handle search input
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Handle filter change
  const handleStatusFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
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

  // Handle modal for viewing donor details
  const handleViewInfo = (donor: Donor) => {
    setSelectedDonor(donor);
    setShowModal(true);
  };

  // Handle delete donor
  const handleDelete = (donor: Donor) => {
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
                Mobile Number
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
                    {donor.mobileNumber}
                  </td>
                  {/* <td
                    className={classNames(
                      "border-b border-gray-500 py-2 px-4 font-semibold",
                      donor.status === "active"
                        ? "text-green-500"
                        : "text-red-500"
                    )}
                  >
                    {toSentenceCase(donor.status)}
                  </td> */}
                  <td className="border-b border-gray-500 py-2 px-4">
                    <button
                      onClick={() => handleViewInfo(donor)}
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

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:bg-gray-300"
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:bg-gray-300"
        >
          Next
        </button>
      </div>

      {/* Modal for Donor Details */}
      {showModal && selectedDonor && (
        <div className="fixed text-gray-700 inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-xl mb-4">
              Donor Details: {selectedDonor.firstName} {selectedDonor.lastName}
            </h2>
            <p>Email: {selectedDonor.email}</p>
            {/* Add other donor details as needed */}
            <button
              onClick={() => setShowModal(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonorTable;
