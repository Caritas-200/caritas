import React, { useState, useMemo, ChangeEvent } from "react";

interface Donor {
  firstName: string;
  middleName?: string;
  lastName: string;
  mobileNumber: string;
  age: number;
  address: string;
  country: string;
  gender: string;
  work: string;
  status: string;
  language: string;
  religion: string;
  email: string;
  password: string;
}

interface DonorTableProps {
  donors: Donor[];
}

const DonorTable: React.FC<DonorTableProps> = ({ donors }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortType, setSortType] = useState<"name" | "date">("name");
  const [isAscending, setIsAscending] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Handle search input
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Handle sorting
  const handleSort = (type: "name" | "date") => {
    if (sortType === type) {
      setIsAscending(!isAscending); // Toggle sort order
    } else {
      setSortType(type);
      setIsAscending(true); // Set ascending order for new sort type
    }
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page on items per page change
  };

  // Filter and sort donors
  const filteredDonors = useMemo(() => {
    let filtered = donors.filter((donor) =>
      `${donor.firstName} ${donor.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );

    if (sortType === "name") {
      filtered.sort((a, b) => {
        const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
        const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
        if (nameA < nameB) return isAscending ? -1 : 1;
        if (nameA > nameB) return isAscending ? 1 : -1;
        return 0;
      });
    }
    // } else if (sortType === "date") {
    //   filtered.sort((a, b) => {
    //     const dateA = new Date(a.createdAt).getTime();
    //     const dateB = new Date(b.createdAt).getTime();
    //     return isAscending ? dateA - dateB : dateB - dateA;
    //   });
    // }

    return filtered;
  }, [searchQuery, donors, sortType, isAscending]);

  // Pagination logic
  const paginatedDonors = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredDonors.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredDonors, currentPage, itemsPerPage]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredDonors.length / itemsPerPage);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        {/* Search */}
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search by name"
          className="border p-2 rounded-lg"
        />

        {/* Items per page */}
        <select
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          className="border p-2 rounded-lg"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
        </select>
      </div>

      {/* Table */}
      <table className="min-w-full bg-gray-800 border border-gray-300 rounded-lg">
        <thead>
          <tr>
            <th
              className="px-4 py-2 cursor-pointer"
              onClick={() => handleSort("name")}
            >
              Name {sortType === "name" && (isAscending ? "▲" : "▼")}
            </th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Mobile</th>
            <th
              className="px-4 py-2 cursor-pointer"
              onClick={() => handleSort("date")}
            >
              Date Created {sortType === "date" && (isAscending ? "▲" : "▼")}
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedDonors.length > 0 ? (
            paginatedDonors.map((donor, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2">{`${donor.firstName} ${donor.lastName}`}</td>
                <td className="px-4 py-2">{donor.email}</td>
                <td className="px-4 py-2">{donor.mobileNumber}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center py-4">
                No donors found
              </td>
            </tr>
          )}
        </tbody>
      </table>

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
    </div>
  );
};

export default DonorTable;
