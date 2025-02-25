import React, { useState, useEffect } from "react";
import classNames from "classnames";
import SearchBar from "../SearchBar";
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

  // Updated `useEffect` for filtering
  useEffect(() => {
    const filterAndSortBeneficiaries = () => {
      const filtered = beneficiaries.filter((beneficiary) => {
        // Match search term in first name or last name
        const matchesSearchTerm =
          beneficiary.firstName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          beneficiary.lastName.toLowerCase().includes(searchTerm.toLowerCase());

        // Match calamity name
        const matchesCalamityName =
          calamityNameFilter === "" ||
          beneficiary.calamityName === calamityNameFilter;

        return matchesSearchTerm && matchesCalamityName;
      });

      // Sorting logic
      const sorted = [...filtered];
      if (sortOrder === "asc" || sortOrder === "desc") {
        sorted.sort((a, b) =>
          sortOrder === "asc"
            ? a.lastName.localeCompare(b.lastName)
            : b.lastName.localeCompare(a.lastName)
        );
      } else if (sortOrder === "calamityAsc" || sortOrder === "calamityDesc") {
        sorted.sort((a, b) =>
          sortOrder === "calamityAsc"
            ? a.calamity.localeCompare(b.calamity)
            : b.calamity.localeCompare(a.calamity)
        );
      } else if (
        sortOrder === "calamityNameAsc" ||
        sortOrder === "calamityNameDesc"
      ) {
        sorted.sort((a, b) =>
          sortOrder === "calamityNameAsc"
            ? (a.calamityName || "").localeCompare(b.calamityName || "")
            : (b.calamityName || "").localeCompare(a.calamityName || "")
        );
      } else if (sortOrder === "date") {
        sorted.sort((a, b) => {
          if (a.dateCreated && b.dateCreated) {
            return b.dateCreated.seconds - a.dateCreated.seconds;
          }
          return 0;
        });
      }

      setFilteredData(sorted);
      setCurrentPage(1);
    };

    filterAndSortBeneficiaries();
  }, [searchTerm, statusFilter, calamityNameFilter, beneficiaries, sortOrder]);

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
      <div className="bg-white-primary p-4 rounded-lg shadow-md text-text-color">
        <div className="flex flex-col md:flex-row items-center mb-4 space-y-4 md:space-y-0 md:space-x-4">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          <select
            value={calamityNameFilter}
            onChange={(e) => setCalamityNameFilter(e.target.value)}
            className="p-2 border rounded-lg "
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
            <table className="min-w-full  border border-border-color rounded-lg">
              <thead>
                <tr>
                  <th className="border border-border-color py-2 px-4 text-left">
                    #
                  </th>
                  <th className="border border-border-color py-2 px-4 text-left">
                    Last Name
                  </th>
                  <th className="border border-border-color py-2 px-4 text-left">
                    First Name
                  </th>
                  <th className="border border-border-color py-2 px-4 text-left">
                    Mobile Number
                  </th>
                  <th className="border border-border-color py-2 px-4 text-left">
                    Date Created
                  </th>
                  <th className="border border-border-color py-2 px-4 text-left">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((beneficiary, index) => (
                  <tr
                    key={beneficiary.id}
                    className="hover:bg-button-hover-bg-color hover:text-white-primary transition-colors"
                  >
                    <td className="border border-border-color py-2 px-4">
                      {index + 1}
                    </td>
                    <td className="border border-border-color py-2 px-4">
                      {toSentenceCase(beneficiary.lastName)}
                    </td>
                    <td className="border border-border-color py-2 px-4">
                      {toSentenceCase(beneficiary.firstName)}
                    </td>
                    <td className="border border-border-color py-2 px-4">
                      {toSentenceCase(beneficiary.mobileNumber)}
                    </td>

                    <td className="border border-border-color py-2 px-4">
                      {convertFirebaseTimestamp(beneficiary.dateCreated)}
                    </td>

                    <td className="flex border gap-2 border-border-color py-2 px-4">
                      <button
                        onClick={() => handleViewInfo(beneficiary.id)}
                        className="bg-blue-500 text-white px-2 py-1 rounded "
                      >
                        View
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
