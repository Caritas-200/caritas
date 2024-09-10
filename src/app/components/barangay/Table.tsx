import React, { useState, useEffect } from "react";
import classNames from "classnames";
import SearchBar from "./SearchBar";
import Pagination from "./Pagination";
import { fetchBeneficiaries } from "@/app/lib/api/beneficiary/data";
import { BeneficiaryForm } from "@/app/lib/definitions";
import { convertFirebaseTimestamp } from "@/app/util/firebaseTimestamp";
import { toSentenceCase } from "@/app/util/toSentenceCase";
import BeneficiaryInfoModal from "./BeneficiaryInfoModal"; // Import the BeneficiaryInfoModal component

interface TableProps {
  brgyName: string;
}

const Table: React.FC<TableProps> = ({ brgyName }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [sortOrder, setSortOrder] = useState<string>("none");
  const [filteredData, setFilteredData] = useState<BeneficiaryForm[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<BeneficiaryForm[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState<
    string | null
  >(null);

  // Fetch data when the component mounts or brgyName changes
  useEffect(() => {
    const loadBeneficiaries = async () => {
      setLoading(true);
      try {
        const data = await fetchBeneficiaries(brgyName);
        setBeneficiaries(data);
        setFilteredData(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error occurred while fetching beneficiaries.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadBeneficiaries();
  }, [brgyName]);

  // Filter data based on search term and status
  useEffect(() => {
    const filtered = beneficiaries.filter((beneficiary) => {
      const matchesSearchTerm =
        beneficiary.firstName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        beneficiary.middleName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        beneficiary.lastName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || beneficiary.status === statusFilter;

      return matchesSearchTerm && matchesStatus;
    });

    // Sorting logic
    const sorted = [...filtered];
    if (sortOrder === "asc") {
      sorted.sort((a, b) => a.lastName.localeCompare(b.lastName));
    } else if (sortOrder === "desc") {
      sorted.sort((a, b) => b.lastName.localeCompare(a.lastName));
    } else if (sortOrder === "date") {
      sorted.sort(
        (a, b) => b.dateCreated.toMillis() - a.dateCreated.toMillis()
      );
    }

    setFilteredData(sorted);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, beneficiaries, sortOrder]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleViewInfo = (id: string) => {
    setSelectedBeneficiaryId(id);
  };

  const handleCloseModal = () => {
    setSelectedBeneficiaryId(null);
  };

  return (
    <>
      <div className="bg-gray-800 p-4 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row items-center mb-4 space-y-4 md:space-y-0 md:space-x-4">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border rounded-lg text-gray-700"
          >
            <option value="all">All</option>
            <option value="claimed">Claimed</option>
            <option value="unclaimed">Unclaimed</option>
          </select>

          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(parseInt(e.target.value, 10))}
            className="p-2 border rounded-lg text-gray-700"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="p-2 border rounded-lg text-gray-700"
          >
            <option value="none">No Sorting</option>
            <option value="asc">Sort by Last Name (A-Z)</option>
            <option value="desc">Sort by Last Name (Z-A)</option>
            <option value="date">Sort by Date Created (Latest First)</option>
          </select>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 border border-gray-500 rounded-lg">
              <thead>
                <tr>
                  <th className="border-b border-gray-500 py-2 px-4 text-left">
                    Last Name
                  </th>
                  <th className="border-b border-gray-500 py-2 px-4 text-left">
                    First Name
                  </th>
                  <th className="border-b border-gray-500 py-2 px-4 text-left">
                    Middle Name
                  </th>
                  <th className="border-b border-gray-500 py-2 px-4 text-left">
                    Date Created
                  </th>
                  <th className="border-b border-gray-500 py-2 px-4 text-left">
                    Status
                  </th>
                  <th className="border-b border-gray-500 py-2 px-4 text-left">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((beneficiary) => (
                  <tr
                    key={beneficiary.id}
                    className="hover:bg-gray-700 transition-colors"
                  >
                    <td className="border-b border-gray-500 py-2 px-4">
                      {toSentenceCase(beneficiary.lastName)}
                    </td>
                    <td className="border-b border-gray-500 py-2 px-4">
                      {toSentenceCase(beneficiary.firstName)}
                    </td>
                    <td className="border-b border-gray-500 py-2 px-4">
                      {toSentenceCase(beneficiary.middleName)}
                    </td>
                    <td className="border-b border-gray-500 py-2 px-4">
                      {convertFirebaseTimestamp(beneficiary.dateCreated)}
                    </td>
                    <td
                      className={classNames(
                        "border-b border-gray-500 py-2 px-4 font-semibold",
                        beneficiary.status === "claimed"
                          ? "text-green-500"
                          : "text-orange-500"
                      )}
                    >
                      {toSentenceCase(beneficiary.status)}
                    </td>
                    <td className="border-b border-gray-500 py-2 px-4">
                      <button
                        onClick={() => handleViewInfo(beneficiary.id)}
                        className="bg-blue-500 text-white py-1 px-3 rounded-lg"
                      >
                        View Info
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>

      {/* Render the modal if a beneficiary is selected */}
      {selectedBeneficiaryId && (
        <BeneficiaryInfoModal
          brgyName={brgyName}
          beneficiaryId={selectedBeneficiaryId}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default Table;
