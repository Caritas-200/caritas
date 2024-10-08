import React, { useState, useEffect } from "react";
import classNames from "classnames";
import SearchBar from "./SearchBar";
import Pagination from "../Pagination";
import {
  fetchBeneficiaries,
  deleteBeneficiary,
} from "@/app/lib/api/beneficiary/data";
import { BeneficiaryForm } from "@/app/lib/definitions";
import { convertFirebaseTimestamp } from "@/app/util/firebaseTimestamp";
import { toSentenceCase } from "@/app/util/toSentenceCase";
import BeneficiaryInfoModal from "./modal/BeneficiaryInfoModal";
import Swal from "sweetalert2";
import BeneficiaryModal from "./modal/BeneficiaryForm";

interface TableProps {
  brgyName: string;
}

const Table: React.FC<TableProps> = ({ brgyName }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [calamityNameFilter, setCalamityNameFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [sortOrder, setSortOrder] = useState<string>("none");
  const [filteredData, setFilteredData] = useState<BeneficiaryForm[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<BeneficiaryForm[]>([]);
  const [localBeneficiaries, setLocalBeneficiaries] = useState(beneficiaries);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState<
    string | null
  >(null);
  const [calamityNameOptions, setCalamityNameOptions] = useState<string[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBeneficiaryInfo, setSelectedBeneficiaryInfo] =
    useState<BeneficiaryForm>();

  // Fetch data when the component mounts or brgyName changes
  useEffect(() => {
    const loadBeneficiaries = async () => {
      setLoading(true);
      try {
        const data = await fetchBeneficiaries(brgyName);
        setBeneficiaries(data);
        setFilteredData(data);
        // Extract unique calamity names for the dropdown
        const uniqueCalamities = Array.from(
          new Set(data.map((item) => item.calamityName || ""))
        ).filter((name) => name !== ""); // Remove empty strings
        setCalamityNameOptions(uniqueCalamities);
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

  // Filter data based on search term, status, and calamity name
  useEffect(() => {
    const filtered = localBeneficiaries.filter((beneficiary) => {
      const matchesSearchTerm =
        beneficiary.firstName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        beneficiary.lastName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || beneficiary.status === statusFilter;

      const matchesCalamityName =
        calamityNameFilter === "" ||
        beneficiary.calamityName === calamityNameFilter;

      return matchesSearchTerm && matchesStatus && matchesCalamityName;
    });

    // Sorting logic
    const sorted = [...filtered];
    if (sortOrder === "asc" || sortOrder === "desc") {
      sorted.sort((a, b) => {
        const compare =
          sortOrder === "asc"
            ? a.lastName.localeCompare(b.lastName)
            : b.lastName.localeCompare(a.lastName);
        return compare;
      });
    } else if (sortOrder === "calamityAsc" || sortOrder === "calamityDesc") {
      sorted.sort((a, b) => {
        const compare =
          sortOrder === "calamityAsc"
            ? a.calamity.localeCompare(b.calamity)
            : b.calamity.localeCompare(a.calamity);
        return compare;
      });
    } else if (
      sortOrder === "calamityNameAsc" ||
      sortOrder === "calamityNameDesc"
    ) {
      sorted.sort((a, b) => {
        const compare =
          sortOrder === "calamityNameAsc"
            ? (a.calamityName || "").localeCompare(b.calamityName || "")
            : (b.calamityName || "").localeCompare(a.calamityName || "");
        return compare;
      });
    } else if (sortOrder === "date") {
      sorted.sort(
        (a, b) => b.dateCreated.toMillis() - a.dateCreated.toMillis()
      );
    }

    setFilteredData(sorted);
    setCurrentPage(1);
  }, [
    searchTerm,
    statusFilter,
    calamityNameFilter,
    localBeneficiaries,
    sortOrder,
  ]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleViewInfo = (id: string) => {
    setSelectedBeneficiaryId(id);
  };

  // Handle delete donor
  const handleEdit = (beneficiary: BeneficiaryForm) => {
    setShowEditModal((prev) => !prev);
    setSelectedBeneficiaryInfo(beneficiary);
  };

  // Handle delete donor
  const handleDelete = (beneficiary: BeneficiaryForm) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete ${beneficiary.firstName} ${beneficiary.lastName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Logic for deleting the beneficiaries
        deleteBeneficiary(brgyName, beneficiary.id)
          .then(() => {
            // Remove the deleted beneficiaries from the local state
            setLocalBeneficiaries((prevBeneficiaries) =>
              prevBeneficiaries.filter((b) => b.id !== beneficiary.id)
            );
            Swal.fire(
              "Deleted!",
              "The beneficiary has been deleted.",
              "success"
            );
          })
          .catch((error) => {
            Swal.fire(
              "Error!",
              "There was a problem deleting the beneficiary.",
              "error"
            );
            console.error("Error deleting beneficiary:", error);
          });
      }
    });
  };

  const handleCloseModal = () => {
    setSelectedBeneficiaryId(null);
    setShowEditModal(false);
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
            value={calamityNameFilter}
            onChange={(e) => setCalamityNameFilter(e.target.value)}
            className="p-2 border rounded-lg text-gray-700"
          >
            <option value="">All Calamity Names</option>
            {calamityNameOptions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
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
            <option value="calamityAsc">Sort by Calamity (A-Z)</option>
            <option value="calamityDesc">Sort by Calamity (Z-A)</option>
            <option value="calamityNameAsc">Sort by Calamity Name (A-Z)</option>
            <option value="calamityNameDesc">
              Sort by Calamity Name (Z-A)
            </option>
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
                    Calamity
                  </th>
                  <th className="border-b border-gray-500 py-2 px-4 text-left">
                    Calamity Name
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
                      {toSentenceCase(beneficiary.calamity)}
                    </td>
                    <td className="border-b border-gray-500 py-2 px-4">
                      {toSentenceCase(beneficiary.calamityName)}
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

                    <td className="flex gap-2 border-b border-gray-500 py-2 px-4">
                      <button
                        onClick={() => handleViewInfo(beneficiary.id)}
                        className="bg-blue-500 text-white px-2 py-1 rounded "
                      >
                        View Info
                      </button>

                      <button
                        onClick={() => handleEdit(beneficiary)}
                        className="bg-green-500 text-white px-2 py-1 rounded "
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(beneficiary)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Delete
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

      {showEditModal && selectedBeneficiaryInfo && (
        <BeneficiaryModal
          brgyName={brgyName}
          onClose={handleCloseModal}
          initialFormData={selectedBeneficiaryInfo}
          isEditing={true}
          onSubmit={function (data: BeneficiaryForm): void {
            throw new Error("Function not implemented.");
          }}
        />
      )}
    </>
  );
};

export default Table;
