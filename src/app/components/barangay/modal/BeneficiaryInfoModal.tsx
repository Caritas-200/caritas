import React, { useState, useEffect } from "react";
import { fetchBeneficiaryById } from "@/app/lib/api/beneficiary/data";
import { BeneficiaryForm } from "@/app/lib/definitions";
import { convertFirebaseTimestamp } from "@/app/util/firebaseTimestamp";
import { toSentenceCase } from "@/app/util/toSentenceCase";
import { formatToPHP } from "@/app/util/formatToPHP";
import Image from "next/image";

interface BeneficiaryInfoModalProps {
  brgyName: string;
  beneficiaryId: string;
  onClose: () => void;
}

const BeneficiaryInfoModal: React.FC<BeneficiaryInfoModalProps> = ({
  brgyName,
  beneficiaryId,
  onClose,
}) => {
  const [beneficiary, setBeneficiary] = useState<BeneficiaryForm | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBeneficiary = async () => {
      try {
        const data = await fetchBeneficiaryById(brgyName, beneficiaryId);
        setBeneficiary(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchBeneficiary();
  }, [brgyName, beneficiaryId]);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (!beneficiary) {
    return <div className="p-4">Beneficiary not found</div>;
  }

  // Safely extract address fields and handle undefined cases
  const { address } = beneficiary;
  const fullAddress = [
    address?.barangay?.barangay_name,
    address?.cityMunicipality?.municipality_name,
    address?.province?.province_name,
    address?.region?.region_name,
  ]
    .filter(Boolean) // Remove any undefined or null values
    .join(", ");

  const fields = {
    "Mobile Number": beneficiary.mobileNumber,
    Age: beneficiary.age,
    Address: fullAddress || "N/A",
    Gender: beneficiary.gender,
    Occupation: beneficiary.occupation,
    "Civil Status": beneficiary.civilStatus,
    Ethnicity: beneficiary.ethnicity,
    Religion: beneficiary.religion,
    Email: beneficiary.email,
    "Housing Condition": beneficiary.housingCondition,
    Casualty: beneficiary.casualty,
    "Beneficiary 4Ps": beneficiary.beneficiary4Ps,
    "Monthly Net Income": formatToPHP(+beneficiary.monthlyNetIncome),
    "Health Condition": beneficiary.healthCondition,
    "Ownership/Rental Type": beneficiary.ownershipRentalType.join(", "),
    Code: beneficiary.code.join(", "),
    "Date Created": convertFirebaseTimestamp(beneficiary.dateCreated),
    Status: beneficiary.isClaimed,
    Calamity: beneficiary.calamity,
    "Calamity Name": beneficiary.calamityName,
  };

  const claimedDetails = [
    { label: "Donation type:", value: beneficiary.donationType || "N/A" },
    {
      label: "Amount:",
      value: beneficiary.cost ? beneficiary.cost + " Pesos" : "N/A",
    },
    {
      label: "Date Claimed:",
      value: beneficiary.dateClaimed
        ? convertFirebaseTimestamp(beneficiary.dateClaimed)
        : "N/A",
    },
    {
      label: "Quantity:",
      value: beneficiary.quantity
        ? toSentenceCase(beneficiary.quantity)
        : "N/A",
    },
  ].filter((detail) => detail.value !== "N/A"); // Optionally remove entries with missing values

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 ">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-screen-lg max-h-[90%] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-gray-300 pb-2 mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Beneficiary Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        {/* Display the full name first */}
        <div className="text-start mb-4 font-bold text-gray-900">
          <h3 className="text-2xl font-bold">
            {toSentenceCase(beneficiary.firstName)}{" "}
            {toSentenceCase(beneficiary.middleName)}{" "}
            {toSentenceCase(beneficiary.lastName)}
          </h3>
        </div>

        {beneficiary.isClaimed && beneficiary.claimantImage && (
          <div className="relative grid grid-cols-4 mb-6 p-4 border-4 rounded-lg border-green-500  gap-x-12 gap-6 shadow-md">
            <h1 className="absolute top-[-0] right-4 text-green-600 rounded-lg bg-white px-2 -mt-3.5 font-bold">
              CLAIMED
            </h1>

            <div>
              <div className="text-gray-700 font-semibold mb-2 w-full whitespace-nowrap">
                Claimant Image:
              </div>
              <Image
                className="rounded-lg border-4 w-full"
                src={beneficiary.claimantImage}
                width={200}
                height={200}
                alt="image"
              />
            </div>
            {claimedDetails &&
              claimedDetails.filter(Boolean).map((field, index) => (
                <div className="flex flex-col gap-2 w-full" key={index}>
                  <div className="text-gray-700 font-semibold mb-1">
                    {field.label}
                  </div>
                  <div className="text-gray-900 p-2 bg-gray-100 shadow-inner rounded-md">
                    {Array.isArray(field.value)
                      ? field.value.map((item, idx) => (
                          <div key={idx}>{`${idx + 1}. ${item}`}</div>
                        ))
                      : field.value}
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Map over the remaining details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-x-12 gap-2 ">
          {Object.entries(fields).map(
            ([key, value]) =>
              value && (
                <div key={key} className="grid grid-cols-2 mb-1">
                  <div className="text-gray-700 font-semibold">{key}:</div>
                  <div className="text-gray-900 p-2 bg-gray-100 shadow-inner rounded-md">
                    {typeof value === "string" ? toSentenceCase(value) : value}
                  </div>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryInfoModal;
