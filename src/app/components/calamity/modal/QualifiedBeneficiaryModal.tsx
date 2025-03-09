import React, { useState, useEffect } from "react";
import Pagination from "../../Pagination";
import { convertFirebaseTimestamp } from "@/app/util/firebaseTimestamp";
import { toSentenceCase } from "@/app/util/toSentenceCase";
import { CalamityBeneficiary } from "@/app/lib/definitions";
import { fetchBeneficiariesByCalamity } from "@/app/lib/api/calamity/data";
import SkeletonTable from "../animation/tableSkeleton";
import BeneficiaryIdQr from "../../barangay/modal/BeneficiaryIdQr";
import UserFormModal from "../../qr/ConfirmedBeneficiaryModal";
import { UserData, DecodedData } from "@/app/lib/definitions";
import { fetchBeneficiaries } from "@/app/lib/api/beneficiary/data";
import { printQualifiedBeneficiaries } from "@/app/util/printQualfiedBeneficiaries";

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

  const [printOption, setPrintOption] = useState<string>("all");

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
    const filterData = () => {
      let dataToFilter = beneficiaries;

      if (printOption === "claimed") {
        dataToFilter = beneficiaries.filter(
          (beneficiary) => beneficiary.isClaimed
        );
      } else if (printOption === "unclaimed") {
        dataToFilter = beneficiaries.filter(
          (beneficiary) => !beneficiary.isClaimed
        );
      }

      const filtered = dataToFilter.filter((beneficiary) =>
        beneficiary.beneficiaryName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      );

      setFilteredData(filtered);
      setCurrentPage(1);
    };

    filterData();
  }, [searchTerm, printOption, beneficiaries]);

  const handleViewInfo = async (beneficiary: CalamityBeneficiary) => {
    if (beneficiary.brgyName && beneficiary.calamityName) {
      //fetch data from beneficiaries using barangay name as path
      const result = await fetchBeneficiaries(beneficiary.brgyName);

      console.log(result);

      if (result.length > 0) {
        setSelectedBeneficiary(result[0]);
        setActiveModal("info");

        setDecodedData({
          id: beneficiary.id,
          calamityName: beneficiary.calamityName,
          brgyName: beneficiary.brgyName,
        });

        const newObject = { ...result[0], ...beneficiary };

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

      const newObject = { ...result[0], ...beneficiary };
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

  const handlePrint = async () => {
    console.log("Filtered Data:", filteredData);

    let dataToPrint = filteredData;
    if (printOption === "claimed") {
      dataToPrint = filteredData.filter((beneficiary) => beneficiary.isClaimed);
    } else if (printOption === "unclaimed") {
      dataToPrint = filteredData.filter(
        (beneficiary) => !beneficiary.isClaimed
      );
    }

    await printQualifiedBeneficiaries(calamityData, dataToPrint);
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
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name"
              className="p-2 border rounded-lg w-full"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(parseInt(e.target.value, 10))}
              className="p-2 border rounded-lg text-gray-700"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>
            <select
              value={printOption}
              onChange={(e) => setPrintOption(e.target.value)}
              className="p-2 border rounded-lg text-gray-700"
            >
              <option value="all">All</option>
              <option value="claimed">Claimed</option>
              <option value="unclaimed">Unclaimed</option>
            </select>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-lg"
              onClick={handlePrint}
            >
              Print
            </button>
          </div>
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
                    Barangay
                  </th>
                  <th className="border border-border-color py-2 px-4 text-left">
                    Status
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
                      className={`border border-border-color py-2 px-4 
                      `}
                    >
                      {beneficiary.brgyName
                        ? toSentenceCase(beneficiary.brgyName)
                        : "N/A"}
                    </td>

                    <td className="border border-border-color py-2 px-4 whitespace-nowrap">
                      {beneficiary.isClaimed ? (
                        <h1 className="text-green-500 font-bold uppercase ">
                          Claimed
                        </h1>
                      ) : (
                        <h1 className="text-yellow-500 font-bold uppercase ">
                          Unclaimed
                        </h1>
                      )}
                    </td>

                    <td className="border border-border-color py-2 px-4 whitespace-nowrap">
                      {beneficiary.isClaimed ? (
                        <h1 className="uppercase">N/A</h1>
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
                            View ID with QR
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
            selectedCalamity={""}
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
