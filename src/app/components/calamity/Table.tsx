import React, { useState, useEffect } from "react";
import SearchBar from "../SearchBar";
import Pagination from "../Pagination";
import { fetchBeneficiaries } from "@/app/lib/api/beneficiary/data";
import { getAllBarangays } from "@/app/lib/api/barangay/data";
import { BeneficiaryForm } from "@/app/lib/definitions";
import { convertFirebaseTimestamp } from "@/app/util/firebaseTimestamp";
import { toSentenceCase } from "@/app/util/toSentenceCase";
import { updateQualificationStatus } from "@/app/lib/api/calamity/data";
import Swal from "sweetalert2";

const Table: React.FC = () => {
  const [barangays, setBarangays] = useState<{ id: string; name: string }[]>(
    []
  );
  const [selectedBarangay, setSelectedBarangay] = useState<string | null>(null);
  const [beneficiaries, setBeneficiaries] = useState<BeneficiaryForm[]>([]);
  const [filteredData, setFilteredData] = useState<BeneficiaryForm[]>([]);
  const [isQualified, setIsQualified] = useState<{
    [key: string]: boolean | null;
  }>({});
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
        setIsQualified((prev) => ({
          ...prev,
          [id]: status,
        }));

        // Optimistically update calamity column if qualifying
        if (status && calamityData) {
          setBeneficiaries((prev) =>
            prev.map((beneficiary) =>
              beneficiary.id === id
                ? {
                    ...beneficiary,
                    calamity: `${calamityData.calamityType} ${calamityData.name}`,
                  }
                : beneficiary
            )
          );
        } else if (!status) {
          setBeneficiaries((prev) =>
            prev.map((beneficiary) =>
              beneficiary.id === id
                ? {
                    ...beneficiary,
                    calamity: "",
                  }
                : beneficiary
            )
          );
        }

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
      console.error("Error updating qualification status:", error);

      // Revert the UI update on error
      setIsQualified((prev) => ({
        ...prev,
        [id]: !status,
      }));

      if (status) {
        // Reset calamity value to N/A on failure
        setBeneficiaries((prev) =>
          prev.map((beneficiary) =>
            beneficiary.id === id
              ? {
                  ...beneficiary,
                  calamity: "N/A",
                }
              : beneficiary
          )
        );
      }

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
      } catch (err) {
        console.error("Error fetching barangays:", err);
      }
    };
    loadBarangays();
  }, []);

  useEffect(() => {
    if (!selectedBarangay) return;

    const loadBeneficiaries = async () => {
      setLoading(true);
      try {
        const data = await fetchBeneficiaries(selectedBarangay);
        setBeneficiaries(data);
        setFilteredData(data);

        // Map initial status from the fetched data
        const initialStatus = data.reduce((acc, item) => {
          acc[item.id] = item.isQualified ?? null; // Use null if isQualified is undefined
          return acc;
        }, {} as { [key: string]: boolean | null });
        setIsQualified(initialStatus);
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
  }, [selectedBarangay]);

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

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md text-gray-100">
      <div className="flex flex-col mb-4 space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
        <select
          onChange={(e) => setSelectedBarangay(e.target.value)}
          className="p-2 border rounded-lg text-gray-700"
        >
          <option value="">Select Barangay</option>
          {barangays.map((barangay) => (
            <option key={barangay.id} value={barangay.id}>
              {toSentenceCase(barangay.name)}
            </option>
          ))}
        </select>
        <div className="flex flex-row w-full gap-4 justify-end">
          <div className="w-1/3">
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
          <table className="min-w-full bg-gray-800 border border-gray-500 rounded-lg">
            <thead>
              <tr>
                <th className="border border-gray-500 py-2 px-4 text-left">
                  #
                </th>
                <th className="border border-gray-500 py-2 px-4 text-left">
                  Last Name
                </th>
                <th className="border border-gray-500 py-2 px-4 text-left">
                  First Name
                </th>
                <th className="border border-gray-500 py-2 px-4 text-left">
                  Calamity
                </th>
                <th className="border border-gray-500 py-2 px-4 text-left">
                  Date Verified
                </th>
                <th className="border border-gray-500 py-2 px-4 text-left">
                  Qualification
                </th>
                <th className="border border-gray-500 py-2 px-4 text-left">
                  Action/Status
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((beneficiary, index) => (
                <tr
                  key={beneficiary.id}
                  className="hover:bg-gray-700 transition-colors"
                >
                  <td className="border border-gray-500 py-2 px-4">
                    {index + 1}
                  </td>
                  <td className="border border-gray-500 py-2 px-4">
                    {toSentenceCase(beneficiary.lastName)}
                  </td>
                  <td className="border border-gray-500 py-2 px-4">
                    {toSentenceCase(beneficiary.firstName)}
                  </td>
                  <td className="border border-gray-500 py-2 px-4">
                    {beneficiary.calamity ? (
                      toSentenceCase(
                        beneficiary.calamity + " " + beneficiary.calamityName
                      )
                    ) : (
                      <span className="uppercase">N/A</span>
                    )}
                  </td>
                  <td className="border border-gray-500 py-2 px-4">
                    {beneficiary.dateVerified
                      ? convertFirebaseTimestamp(beneficiary.dateVerified)
                      : "N/A"}
                  </td>
                  <td
                    className={`border border-gray-500 py-2 px-4 ${
                      isQualified[beneficiary.id] === true
                        ? "text-green-500 font-bold"
                        : ""
                    }`}
                  >
                    {isQualified[beneficiary.id] === true
                      ? "Qualified"
                      : isQualified[beneficiary.id] === false
                      ? "Unqualified"
                      : "N/A"}
                  </td>

                  <td className="border border-gray-500 py-2 px-4 whitespace-nowrap">
                    {beneficiary.isClaimed ? (
                      <h1 className="text-green-500 font-bold uppercase">
                        Claimed
                      </h1>
                    ) : (
                      <>
                        {" "}
                        <button
                          className={`mr-2 px-2 py-1 rounded ${
                            isQualified[beneficiary.id] === true
                              ? "bg-gray-500"
                              : "bg-green-500"
                          }`}
                          disabled={isQualified[beneficiary.id] === true}
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
                          className={`px-2 py-1 rounded ${
                            isQualified[beneficiary.id] === false
                              ? "bg-gray-500"
                              : "bg-red-500"
                          }`}
                          disabled={isQualified[beneficiary.id] === false}
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
    </div>
  );
};

export default Table;
