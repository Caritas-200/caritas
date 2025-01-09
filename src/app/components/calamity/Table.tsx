import React, { useState, useEffect } from "react";
import SearchBar from "../barangay/SearchBar";
import Pagination from "../Pagination";
import { fetchBeneficiaries } from "@/app/lib/api/beneficiary/data";
import { getAllBarangays } from "@/app/lib/api/barangay/data";
import { BeneficiaryForm } from "@/app/lib/definitions";
import { convertFirebaseTimestamp } from "@/app/util/firebaseTimestamp";
import { toSentenceCase } from "@/app/util/toSentenceCase";

const Table: React.FC = () => {
  const [barangays, setBarangays] = useState<{ id: string; name: string }[]>(
    []
  );
  const [selectedBarangay, setSelectedBarangay] = useState<string | null>(null);
  const [beneficiaries, setBeneficiaries] = useState<BeneficiaryForm[]>([]);
  const [filteredData, setFilteredData] = useState<BeneficiaryForm[]>([]);
  const [qualificationStatus, setQualificationStatus] = useState<{
    [key: string]: "Qualified" | "Unqualified" | null;
  }>({});
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
        const initialStatus = data.reduce((acc, item) => {
          acc[item.id] = null; // Default status
          return acc;
        }, {} as { [key: string]: "Qualified" | "Unqualified" | null });
        setQualificationStatus(initialStatus);
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

  const handleQualification = (
    id: string,
    status: "Qualified" | "Unqualified"
  ) => {
    setQualificationStatus((prev) => ({
      ...prev,
      [id]: status,
    }));
  };

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
                <th className="border-b border-gray-500 py-2 px-4 text-left">
                  Last Name
                </th>
                <th className="border-b border-gray-500 py-2 px-4 text-left">
                  First Name
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
                    {convertFirebaseTimestamp(beneficiary.dateCreated)}
                  </td>
                  <td
                    className={`border-b border-gray-500 py-2 px-4 ${
                      qualificationStatus[beneficiary.id] === "Qualified"
                        ? "text-green-500 font-bold"
                        : ""
                    }`}
                  >
                    {qualificationStatus[beneficiary.id] || "Unqualified"}
                  </td>
                  <td className="border-b border-gray-500 py-2 px-4">
                    <button
                      className={`mr-2 px-2 py-1 rounded ${
                        qualificationStatus[beneficiary.id] === "Qualified"
                          ? "bg-gray-500"
                          : "bg-green-500"
                      }`}
                      disabled={
                        qualificationStatus[beneficiary.id] === "Qualified"
                      }
                      onClick={() =>
                        handleQualification(beneficiary.id, "Qualified")
                      }
                    >
                      Qualify
                    </button>
                    <button
                      className={`px-2 py-1 rounded ${
                        qualificationStatus[beneficiary.id] === "Unqualified"
                          ? "bg-gray-500"
                          : "bg-red-500"
                      }`}
                      disabled={
                        qualificationStatus[beneficiary.id] === "Unqualified"
                      }
                      onClick={() =>
                        handleQualification(beneficiary.id, "Unqualified")
                      }
                    >
                      Unqualify
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
    </div>
  );
};

export default Table;
