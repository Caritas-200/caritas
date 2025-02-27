import React, { useState } from "react";
import { UserData, CalamityBeneficiary } from "@/app/lib/definitions";
import Swal from "sweetalert2";
import WebcamCapture from "./subComponent/WebcamCapture";
import DonationForm from "./subComponent/DonationForm";
import BeneficiaryDetails from "./subComponent/BeneficiaryDetails";
import { convertBase64ToFile } from "@/app/util/convertBase64ToFile";
import Dropdown from "./button/dropdown";
import { radioGroups } from "@/app/config/qrFormConfig";
import { DecodedData } from "@/app/lib/definitions";
import {
  validateBenefitForm,
  validateCapturedImage,
  validateConditions,
} from "@/app/util/validationQRForm";
import { updateVerifiedBeneficiary } from "@/app/lib/api/calamity/data";
import Calamity from "@/app/(ui)/calamity/page";

interface ModalProps {
  data: UserData;
  onClose: () => void;
  decodedData: DecodedData;
}

const ConfirmedBeneficiaryModal: React.FC<ModalProps> = ({
  data,
  onClose,
  decodedData,
}) => {
  const [formData, setFormData] = useState<CalamityBeneficiary>(
    data as CalamityBeneficiary
  );
  const [benefitForm, setBenefitForm] = useState({
    donationType: [] as string[],
    description: "",
    cost: "",
  });
  const [customCost, setCustomCost] = useState("");
  const [isCustomCost, setIsCustomCost] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const handleDropdownChange = (name: keyof UserData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !validateBenefitForm(benefitForm) ||
      !validateCapturedImage(capturedImage) ||
      !validateConditions({
        healthCondition: formData.healthCondition || "",
        housingCondition: formData.housingCondition || "",
        casualty: formData.casualty || "",
      })
    ) {
      return;
    }

    try {
      const imageFile = capturedImage
        ? convertBase64ToFile(capturedImage)
        : null;
      const result = await updateVerifiedBeneficiary(
        decodedData.id,
        benefitForm,
        decodedData.calamityName,
        true,
        imageFile,
        formData.healthCondition || "",
        formData.housingCondition || "",
        formData.casualty || ""
      );

      Swal.fire({
        title: result.success ? "Success" : "Error",
        text: result.success
          ? "Benefits successfully released!"
          : result.message,
        icon: result.success ? "success" : "error",
        confirmButtonText: "OK",
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "An error occurred while updating the beneficiary. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 text-gray-700">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl max-h-[90%] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 border-b-2 pb-2 font-semibold">
          <h1 className="uppercase text-xl">
            {formData.firstName} {formData.middleName} {formData.lastName}
          </h1>
          <button
            onClick={onClose}
            className="text-gray-600 text-2xl hover:text-red-500"
          >
            &times;
          </button>
        </div>

        {/* Display form data */}
        <BeneficiaryDetails formData={formData} />

        {/* Benefit Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-between gap-4 flex-col-3 ">
            {/* Dropdowns */}
            {radioGroups.map((group) => (
              <Dropdown
                key={group.name}
                label={group.label}
                name={group.name}
                options={group.options}
                value={formData[group.name] as string}
                onChange={handleDropdownChange}
              />
            ))}
          </div>

          <DonationForm
            benefitForm={benefitForm}
            setBenefitForm={setBenefitForm}
            isCustomCost={isCustomCost}
            setIsCustomCost={setIsCustomCost}
            customCost={customCost}
            setCustomCost={setCustomCost}
          />

          <WebcamCapture
            setIsCameraOpen={setIsCameraOpen}
            setCapturedImage={setCapturedImage}
            isCameraOpen={isCameraOpen}
            capturedImage={capturedImage}
          />

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Submit & Release
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfirmedBeneficiaryModal;
