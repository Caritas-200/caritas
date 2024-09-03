import React, { useState, useEffect } from "react";
import classNames from "classnames";
import SearchBar from "./SearchBar";
import Pagination from "./Pagination";

interface Beneficiary {
  firstName: string;
  middleName: string;
  lastName: string;
  status: "Claimed" | "Unclaimed" | string;
  action: string;
}

interface TableProps {
  data: Beneficiary[];
}

const Table: React.FC<TableProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filteredData, setFilteredData] = useState<Beneficiary[]>([]);

  const itemsPerPage = 5;

  useEffect(() => {
    const filtered = data.filter(
      (beneficiary) =>
        beneficiary.firstName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        beneficiary.middleName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        beneficiary.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        beneficiary.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, data]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md">
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <table className="min-w-full bg-gray-800 border border-gray-300 rounded-lg">
        <thead>
          <tr>
            <th className="border-b py-2 px-4 text-left">Last Name</th>
            <th className="border-b py-2 px-4 text-left">First Name</th>
            <th className="border-b py-2 px-4 text-left">Middle Name</th>
            <th className="border-b py-2 px-4 text-left">Status</th>
            <th className="border-b py-2 px-4 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((beneficiary, index) => (
            <tr key={index} className="hover:bg-gray-700 transition-colors">
              <td className="border-b py-2 px-4">{beneficiary.lastName}</td>
              <td className="border-b py-2 px-4">{beneficiary.firstName}</td>
              <td className="border-b py-2 px-4">{beneficiary.middleName}</td>
              <td
                className={classNames(
                  "border-b py-2 px-4 font-semibold",
                  beneficiary.status === "Claimed"
                    ? "text-green-500"
                    : "text-orange-500"
                )}
              >
                {beneficiary.status}
              </td>
              <td className="border-b py-2 px-4">
                <button className="bg-blue-500 text-white py-1 px-3 rounded-lg">
                  View Info
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default Table;
