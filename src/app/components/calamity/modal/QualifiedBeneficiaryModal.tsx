import React, { useState, useEffect } from "react";
import Pagination from "../../Pagination";
import SearchBar from "../../SearchBar";
import { convertFirebaseTimestamp } from "@/app/util/firebaseTimestamp";
import { toSentenceCase } from "@/app/util/toSentenceCase";
import { CalamityBeneficiary } from "@/app/lib/definitions";
import { fetchBeneficiariesByCalamity } from "@/app/lib/api/calamity/data";
import SkeletonTable from "../animation/tableSkeleton";
import BeneficiaryIdQr from "../../barangay/modal/BeneficiaryIdQr";
import UserFormModal from "../../qr/ConfirmedBeneficiaryModal";
import { UserData, DecodedData } from "@/app/lib/definitions";
import { fetchBeneficiaries } from "@/app/lib/api/beneficiary/data";

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
  const [beneficiaries, setBeneficiaries] = useState<CalamityBeneficiary[]>([]);
  const [filteredData, setFilteredData] = useState<CalamityBeneficiary[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [qrData, setQrData] = useState("");

  const [activeModal, setActiveModal] = useState<"info" | "qr" | null>(null); // Manage which modal is open
  const [selectedBeneficiary, setSelectedBeneficiary] =
    useState<CalamityBeneficiary | null>(null);
  const [decodedData, setDecodedData] = useState<DecodedData | null>();

  const [userData, setUserData] = useState<UserData>({
    dateCreated: selectedBeneficiary?.dateCreated || {
      seconds: 0,
      nanoseconds: 0,
    },
    familyMembers: selectedBeneficiary?.familyMembers || [
      {
        name: "",
        relation: "",
        age: "",
        gender: "",
        civilStatus: "",
        education: "",
        skills: "",
      },
    ],
    firstName: selectedBeneficiary?.firstName || "",
    lastName: selectedBeneficiary?.lastName || "",
    middleName: selectedBeneficiary?.middleName || "",
    housingCondition: selectedBeneficiary?.housingCondition || "",
    casualty: selectedBeneficiary?.casualty || "",
    healthCondition: selectedBeneficiary?.healthCondition || "",
  });

  const closeModals = () => {
    setActiveModal(null);
  };

  useEffect(() => {
    const loadBeneficiaries = async () => {
      setLoading(true);
      try {
        const data = await fetchBeneficiariesByCalamity(calamityData.name);
        const mappedData = data.map((item: any) => ({
          ...item,
          housingCondition: item.housingCondition || "",
          casualty: item.casualty || "",
          healthCondition: item.healthCondition || "",
        }));
        setBeneficiaries(mappedData);
        setFilteredData(mappedData);
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

  const handleViewInfo = async (beneficiary: CalamityBeneficiary) => {
    if (beneficiary.brgyName && beneficiary.calamityName) {
      //fetch data from beneficiaries using barangay name as path
      const result = await fetchBeneficiaries(beneficiary.brgyName);

      if (result.length > 0) {
        setSelectedBeneficiary(result[0]);
        setActiveModal("info");

        setDecodedData({
          id: beneficiary.id,
          calamityName: beneficiary.calamityName,
        });

        const newObject = { ...beneficiary, ...result[0] };

        setUserData(newObject);
      } else {
        setError("No beneficiaries found for the given barangay name.");
      }
    } else {
      setError("Barangay name is undefined.");
    }
  };

  const handleViewQR = async (beneficiary: CalamityBeneficiary) => {
    if (beneficiary.brgyName) {
      //fetch data from beneficiaries using barangay name as path
      const result = await fetchBeneficiaries(beneficiary.brgyName);

      const newObject = { ...beneficiary, ...result[0] };
      setSelectedBeneficiary(newObject);
      setActiveModal("qr");

      const qrPayload = {
        id: beneficiary.id,
        lastName: beneficiary.lastName,
        brgyName: beneficiary.brgyName,
      };
      setQrData(JSON.stringify(qrPayload)); // Set QR data
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white-primary p-4 rounded-lg shadow-md text-text-color w-[90%] max-w-7xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Qualified Beneficiaries</h2>
          <button
            className="text-gray-300 hover:text-red-500 text-4xl p-2"
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
            <table className="min-w-full  border border-border-color rounded-lg">
              <thead>
                <tr>
                  <th className="border border-border-color py-2 px-4 text-left">
                    #
                  </th>
                  <th className="border border-border-color py-2 px-4 text-left">
                    Name
                  </th>
                  <th className="border border-border-color py-2 px-4 text-left">
                    Calamity
                  </th>
                  <th className="border border-border-color py-2 px-4 text-left">
                    Date Verified
                  </th>
                  <th className="border border-border-color py-2 px-4 text-left">
                    Status
                  </th>
                  <th className="border border-border-color py-2 px-4 text-left">
                    Action/Status
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
                      {toSentenceCase(beneficiary.beneficiaryName || "")}
                    </td>
                    <td className="border border-border-color py-2 px-4">
                      {toSentenceCase(
                        beneficiary.calamity + " " + beneficiary.calamityName
                      )}
                    </td>
                    <td className="border border-border-color py-2 px-4">
                      {beneficiary.dateVerified
                        ? beneficiary.dateVerified &&
                          convertFirebaseTimestamp(beneficiary.dateVerified)
                        : "N/A"}
                    </td>
                    <td
                      className={`border border-border-color py-2 px-4 ${
                        beneficiary.isQualified
                          ? "text-green-500 font-bold "
                          : ""
                      }`}
                    >
                      {beneficiary.isQualified ? "Qualified" : "Unqualified"}
                    </td>
                    <td className="border border-border-color py-2 px-4 whitespace-nowrap">
                      {beneficiary.isClaimed ? (
                        <h1 className="text-green-500 font-bold uppercase">
                          Claimed
                        </h1>
                      ) : (
                        <>
                          <button
                            className="mr-2 px-2 py-1 rounded bg-blue-500 text-white-primary hover:bg-blue-600"
                            onClick={() => handleViewInfo(beneficiary)}
                          >
                            View Info
                          </button>
                          <button
                            className="px-2 py-1 rounded bg-purple-500 text-white-primary hover:bg-purple-600"
                            onClick={() => handleViewQR(beneficiary)}
                          >
                            View QR
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
      {/* Dynamic Modal Rendering */}
      {activeModal === "info" && selectedBeneficiary && decodedData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <UserFormModal
            onClose={closeModals}
            data={userData}
            decodedData={decodedData}
          />
        </div>
      )}

      {activeModal === "qr" && selectedBeneficiary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <BeneficiaryIdQr
            beneficiaryData={JSON.stringify(selectedBeneficiary)}
            qrData={qrData}
            onClose={closeModals}
            from="calamity"
          />
        </div>
      )}
    </div>
  );
};

export default BeneficiaryModal;
