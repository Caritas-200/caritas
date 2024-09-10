import React, { useState, useEffect } from "react";
import { fetchBeneficiaryById } from "@/app/lib/api/beneficiary/data";
import { BeneficiaryForm } from "@/app/lib/definitions";
import { convertFirebaseTimestamp } from "@/app/util/firebaseTimestamp";

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

  const fields = {
    "First Name": beneficiary.firstName,
    "Middle Name": beneficiary.middleName,
    "Last Name": beneficiary.lastName,
    "Mobile Number": beneficiary.mobileNumber,
    Age: beneficiary.age,
    Address: beneficiary.address,
    Gender: beneficiary.gender,
    Occupation: beneficiary.occupation,
    "House Number": beneficiary.houseNumber,
    "Civil Status": beneficiary.civilStatus,
    Ethnicity: beneficiary.ethnicity,
    Religion: beneficiary.religion,
    Email: beneficiary.email,
    "Beneficiary 4Ps": beneficiary.beneficiary4Ps,
    "Monthly Net Income": beneficiary.monthlyNetIncome,
    "Housing Condition": beneficiary.housingCondition.join(", "),
    Casualty: beneficiary.casualty.join(", "),
    "Health Condition": beneficiary.healthCondition.join(", "),
    "Ownership/Rental Type": beneficiary.ownershipRentalType.join(", "),
    Code: beneficiary.code.join(", "),
    "Date Created": convertFirebaseTimestamp(beneficiary.dateCreated),
    Status: beneficiary.status,
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-screen-lg">
        <div className="flex items-center justify-between border-b border-gray-300 pb-2 mb-4">
          <h2 className="text-xl font-semibold text-gray-700 ">
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
        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(fields).map(([key, value]) => (
            <div key={key} className="mb-3">
              <div className="text-gray-700 font-semibold">{key}:</div>
              <div className="text-gray-900">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryInfoModal;
