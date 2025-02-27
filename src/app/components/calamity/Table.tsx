import React, { useState, useEffect } from "react";
import SearchBar from "../SearchBar";
import Pagination from "../Pagination";
import { fetchBeneficiaries } from "@/app/lib/api/beneficiary/data";
import { getAllBarangays } from "@/app/lib/api/barangay/data";
import { CalamityBeneficiary } from "@/app/lib/definitions";
import { toSentenceCase } from "@/app/util/toSentenceCase";
import {
  updateQualificationStatus,
  checkRecipientsQualification,
} from "@/app/lib/api/calamity/data";
import Swal from "sweetalert2";
import BeneficiaryInfoModal from "./modal/BeneficiaryInfoModal";

const Table: React.FC = () => {
  const [barangays, setBarangays] = useState<{ id: string; name: string }[]>(
    []
  );
  const [selectedBarangay, setSelectedBarangay] = useState<string | null>(null);
  const [beneficiaries, setBeneficiaries] = useState<CalamityBeneficiary[]>([]);
  const [filteredData, setFilteredData] = useState<CalamityBeneficiary[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState<
    string | null
  >(null);

  const [calamityData, setCalamityData] = useState<{
    name: string;
    calamityType: string;
  } | null>(null);

  const handleQualification = async (
    id: string,
    selectedBarangay: string,
    status: boolean,
    beneficiaryName: string,
    calamityData: { name: string; calamityType: string } | null
  ) => {
    try {
      // Show confirmation modal with adjusted message
      const result = await Swal.fire({
        title: `Confirm Action`,
        text: status
          ? `Are you sure you want to qualify ${beneficiaryName}? This will record them as a calamity beneficiary of the current disaster.`
          : `Are you sure you want to unqualify ${beneficiaryName}? This will remove them from the list of calamity-affected individuals for the current disaster.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: status ? "#28a745" : "#d33",
        cancelButtonColor: "#6c757d",
        confirmButtonText: status ? "Yes, Qualify" : "Yes, Unqualify",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        // Optimistically update the UI for both qualification status and calamity column
        setBeneficiaries((prev) =>
          prev.map((beneficiary) =>
            beneficiary.id === id
              ? {
                  ...beneficiary,
                  isQualified: status,
                  calamity: status
                    ? `${calamityData?.calamityType} ${calamityData?.name}`
                    : "",
                }
              : beneficiary
          )
        );

        // Call the API to update the qualification status in the database
        await updateQualificationStatus(
          id,
          selectedBarangay,
          status,
          calamityData
        );

        // Show success message
        await Swal.fire({
          title: "Success",
          text: `${beneficiaryName} has been successfully ${
            status ? "qualified" : "unqualified"
          } as a calamity beneficiary.`,
          icon: "success",
          confirmButtonColor: "#28a745",
        });
      }
    } catch (error) {
      // Revert the UI update on error
      setBeneficiaries((prev) =>
        prev.map((beneficiary) =>
          beneficiary.id === id
            ? {
                ...beneficiary,
                isQualified: !status,
              }
            : beneficiary
        )
      );

      // Show error message
      await Swal.fire({
        title: "Error",
        text: "An error occurred while updating the qualification status. Please try again.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  useEffect(() => {
    // Retrieve state from sessionStorage
    const data = sessionStorage.getItem("calamityData");
    if (data) {
      setCalamityData(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    const loadBarangays = async () => {
      try {
        const data = await getAllBarangays();
        setBarangays(data);
      } catch (err) {}
    };
    loadBarangays();
  }, []);

  useEffect(() => {
    if (!selectedBarangay) return;

    const loadBeneficiaries = async () => {
      setLoading(true);
      try {
        const data = await fetchBeneficiaries(selectedBarangay);

        // Fetch qualification data from calamity collection
        const recipientIDs = data.map((beneficiary) => beneficiary.id);
        const qualificationData = await checkRecipientsQualification(
          recipientIDs,
          calamityData?.name || ""
        );

        // Merge qualification data with beneficiaries
        const mergedData = data.map((beneficiary) => {
          const qualification = qualificationData.find(
            (q) => q.id === beneficiary.id
          );
          return {
            ...beneficiary,
            isQualified: qualification?.isQualified ?? undefined,
            isClaimed: qualification?.isClaimed ?? false,
            dateVerified: qualification?.dateVerified ?? undefined,
          };
        });

        setBeneficiaries(mergedData);
        setFilteredData(mergedData);
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "Unknown error occurred while fetching beneficiaries."
        );
      } finally {
        setLoading(false);
      }
    };

    loadBeneficiaries();
  }, [selectedBarangay, calamityData]);

  useEffect(() => {
    const filtered = beneficiaries.filter((beneficiary) =>
      [beneficiary.firstName, beneficiary.lastName]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, beneficiaries]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleCloseModal = () => {
    setSelectedBeneficiaryId(null);
  };

  return (
    <div className="bg-white-primary p-4 rounded-lg shadow-md text-text-color">
      <div className="flex flex-col mb-4 space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
        <select
          onChange={(e) => setSelectedBarangay(e.target.value)}
          className="p-2 border rounded-lg "
        >
          <option value="">Select Barangay</option>
          {barangays.map((barangay) => (
            <option key={barangay.id} value={barangay.id}>
              {toSentenceCase(barangay.name)}
            </option>
          ))}
        </select>
        <div className="flex flex-row w-full gap-4 justify-end">
          <div className="w-1/3 ">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(parseInt(e.target.value, 10))}
            className="p-2 border rounded-lg text-gray-700"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </div>
      </div>

      {!selectedBarangay ? (
        <p className="text-gray-300">Please select a barangay to view data.</p>
      ) : loading ? (
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
                  Qualification
                </th>
                <th className="border border-border-color py-2 px-4 text-left">
                  Action/Status
                </th>
                <th className="border border-border-color py-2 px-4 text-left">
                  Info
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((beneficiary, index) => (
                <tr
                  key={beneficiary.id}
                  className="hover:bg-button-hover-bg-color hover:text-bg-color transition-colors"
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

                  <td
                    className={`border border-border-color py-2 px-4 ${
                      beneficiary.isQualified === true
                        ? "text-green-500 font-bold"
                        : ""
                    }`}
                  >
                    {beneficiary.isQualified === true
                      ? "Qualified"
                      : beneficiary.isQualified === false
                      ? "Unqualified"
                      : "N/A"}
                  </td>
                  <td className="border border-border-color py-2 px-4 whitespace-nowrap">
                    {beneficiary.isClaimed ? (
                      <h1 className="text-green-500 font-bold uppercase ">
                        Claimed
                      </h1>
                    ) : (
                      <>
                        <button
                          className={`mr-2 px-2 py-1 rounded text-white ${
                            beneficiary.isQualified === true
                              ? "bg-gray-500"
                              : "bg-green-500"
                          }`}
                          disabled={beneficiary.isQualified === true}
                          onClick={() =>
                            handleQualification(
                              beneficiary.id,
                              selectedBarangay,
                              true,
                              beneficiary.firstName,
                              calamityData
                            )
                          }
                        >
                          Qualify
                        </button>
                        <button
                          className={`px-2 py-1 rounded text-white ${
                            beneficiary.isQualified === false
                              ? "bg-gray-500"
                              : "bg-red-500"
                          }`}
                          disabled={beneficiary.isQualified === false}
                          onClick={() =>
                            handleQualification(
                              beneficiary.id,
                              selectedBarangay,
                              false,
                              beneficiary.firstName,
                              calamityData
                            )
                          }
                        >
                          Unqualify
                        </button>
                      </>
                    )}
                  </td>
                  <td className="border border-border-color py-2 px-4 whitespace-nowrap">
                    <button
                      className="px-2 py-1 rounded bg-blue-500 text-white"
                      onClick={() => setSelectedBeneficiaryId(beneficiary.id)}
                    >
                      View
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
      )}

      {selectedBeneficiaryId && (
        <BeneficiaryInfoModal
          brgyName="test"
          beneficiaryId={selectedBeneficiaryId}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Table;
