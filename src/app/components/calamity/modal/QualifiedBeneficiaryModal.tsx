import React, { useState, useEffect } from "react";
import Pagination from "../../Pagination";
import SearchBar from "../../SearchBar";
import { convertFirebaseTimestamp } from "@/app/util/firebaseTimestamp";
import { toSentenceCase } from "@/app/util/toSentenceCase";
import { BeneficiaryForm } from "@/app/lib/definitions";
import { fetchBeneficiariesByCalamity } from "@/app/lib/api/calamity/data";
import SkeletonTable from "../animation/tableSkeleton";
import UserFormModal from "../../qr/ConfirmedBeneficiaryModal";
import BeneficiaryIdQr from "../../barangay/modal/BeneficiaryIdQr";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  calamityData: { name: string; calamityType: string };
}

const BeneficiaryModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  calamityData,
}) => {
  const [beneficiaries, setBeneficiaries] = useState<BeneficiaryForm[]>([]);
  const [filteredData, setFilteredData] = useState<BeneficiaryForm[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [activeModal, setActiveModal] = useState<"info" | "qr" | null>(null); // Manage which modal is open
  const [selectedBeneficiary, setSelectedBeneficiary] =
    useState<BeneficiaryForm | null>(null);

  const closeModals = () => {
    setActiveModal(null);
  };

  useEffect(() => {
    const loadBeneficiaries = async () => {
      setLoading(true);
      try {
        const data = await fetchBeneficiariesByCalamity(
          calamityData.name,
          calamityData.calamityType
        );
        setBeneficiaries(data);
        setFilteredData(data);
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

    if (isOpen) {
      loadBeneficiaries();
    }
  }, [isOpen, calamityData.name, calamityData.calamityType]);

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

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleViewInfo = (beneficiary: BeneficiaryForm) => {
    setSelectedBeneficiary(beneficiary);
    setActiveModal("info");
  };

  const handleViewQR = (beneficiary: BeneficiaryForm) => {
    setSelectedBeneficiary(beneficiary);
    setActiveModal("qr");
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
      // onClick={handleOutsideClick}
    >
      <div className="bg-gray-800 p-4 rounded-lg shadow-md text-gray-100 w-[90%] max-w-7xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Qualified Beneficiaries</h2>
          <button
            className="text-gray-300 hover:text-red-500 text-xl"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <div className="flex flex-row justify-between mb-4">
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

        {loading ? (
          <>
            <h1 className="mb-2 text-green-500">
              Please wait while we fetch the data from all of the Barangays ...
            </h1>
            <SkeletonTable />
          </>
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
                    Name
                  </th>
                  <th className="border border-gray-500 py-2 px-4 text-left">
                    Calamity
                  </th>
                  <th className="border border-gray-500 py-2 px-4 text-left">
                    Date Verified
                  </th>
                  <th className="border border-gray-500 py-2 px-4 text-left">
                    Status
                  </th>
                  <th className="border border-gray-500 py-2 px-4 text-left">
                    Action
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
                      {toSentenceCase(
                        beneficiary.lastName + " " + beneficiary.firstName
                      )}
                    </td>
                    <td className="border border-gray-500 py-2 px-4">
                      {beneficiary.calamity
                        ? toSentenceCase(
                            beneficiary.calamity +
                              " " +
                              beneficiary.calamityName
                          )
                        : "N/A"}
                    </td>
                    <td className="border border-gray-500 py-2 px-4">
                      {beneficiary.dateVerified
                        ? convertFirebaseTimestamp(beneficiary.dateVerified)
                        : "N/A"}
                    </td>
                    <td
                      className={`border border-gray-500 py-2 px-4 ${
                        beneficiary.isQualified
                          ? "text-green-500 font-bold"
                          : ""
                      }`}
                    >
                      {beneficiary.isQualified ? "Qualified" : "Unqualified"}
                    </td>
                    <td className="border border-gray-500 py-2 px-4 whitespace-nowrap">
                      <button
                        className="mr-2 px-2 py-1 rounded bg-blue-500 hover:bg-blue-600"
                        onClick={() => handleViewInfo(beneficiary)}
                      >
                        View Info
                      </button>
                      <button
                        className="px-2 py-1 rounded bg-purple-500 hover:bg-purple-600"
                        onClick={() => handleViewQR(beneficiary)}
                      >
                        View QR
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

      {/* Dynamic Modal Rendering */}
      {activeModal === "info" && selectedBeneficiary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <UserFormModal
            onClose={closeModals}
            data={selectedBeneficiary}
            decodedData={
              (selectedBeneficiary.id,
              selectedBeneficiary.address.barangay.barangay_name)
            }
          />
        </div>
      )}

      {activeModal === "qr" && selectedBeneficiary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <BeneficiaryIdQr
            beneficiaryData={JSON.stringify(selectedBeneficiary)}
            qrData={selectedBeneficiary.id}
            onClose={closeModals}
          />
        </div>
      )}
    </div>
  );
};

export default BeneficiaryModal;
