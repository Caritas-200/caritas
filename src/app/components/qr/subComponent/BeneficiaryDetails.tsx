import React from "react";
import { CalamityBeneficiary } from "@/app/lib/definitions";

interface BeneficiaryDetailsProps {
  formData: CalamityBeneficiary;
}

const BeneficiaryDetails: React.FC<BeneficiaryDetailsProps> = ({
  formData,
}) => {
  const fields = [
    { label: "Calamity Name", value: formData.calamityName },
    { label: "Calamity Type", value: formData.calamity },
    {
      label: "Date Created",
      // value: new Date(formData.dateCreated.seconds * 1000).toLocaleString(),
    },
  ];

  console.log("formData", formData);
  return (
    <div className="grid grid-cols-3 gap-4 mb-4 border-b pb-2">
      {fields.map(
        ({ label, value }) =>
          value && (
            <div key={label}>
              <span className="block text-sm font-medium">{label}</span>
              <p className="mt-1 p-2 border rounded bg-gray-100">{value}</p>
            </div>
          )
      )}
    </div>
  );
};

export default BeneficiaryDetails;
