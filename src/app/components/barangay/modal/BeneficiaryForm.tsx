import React, { useState } from "react";
import { validateFields } from "@/app/util/validateFields";
import { BeneficiaryForm, Address } from "@/app/lib/definitions";
import CheckboxGroupModal from "./CheckBoxGroupModal";
import {
  BeneficiaryInputFields,
  dropdownFields,
} from "@/app/config/formConfig";
import { Timestamp } from "firebase/firestore";
import regions from "@/json/region.json";
import provinces from "@/json/province.json";
import municipalities from "@/json/municipality.json";
import barangays from "@/json/barangay.json";
import DropdownAddress from "../button/DropDownAddress";
import ProgressBar from "../../ProgressBar";

interface ModalProps {
  onClose: () => void;
  onSubmit: (data: BeneficiaryForm) => void;
  brgyName: string;
  initialFormData?: BeneficiaryForm;
  isEditing?: boolean;
}

const BeneficiaryModal: React.FC<ModalProps> = ({
  onClose,
  onSubmit,
  brgyName,
  initialFormData,
  isEditing,
}) => {
  const [formData, setFormData] = useState<BeneficiaryForm>(
    initialFormData || {
      id: "",
      dateCreated: Timestamp.now(),
      status: "",
      firstName: "",
      middleName: "",
      lastName: "",
      mobileNumber: "",
      age: "",
      houseNumber: "",
      address: {
        region: { region_id: "", region_name: "" },
        province: { province_id: "", region_id: "", province_name: "" },
        cityMunicipality: {
          municipality_id: "",
          province_id: "",
          municipality_name: "",
        },
        barangay: { barangay_id: "", municipality_id: "", barangay_name: "" },
      },
      gender: "",
      occupation: "",
      civilStatus: "",
      ethnicity: "",
      religion: "",
      email: "",
      beneficiary4Ps: "",
      monthlyNetIncome: "",
      housingCondition: [],
      casualty: [],
      healthCondition: [],
      ownershipRentalType: [],
      code: [],
      qrCode: "",
      calamity: "",
      calamityName: "",
    }
  );

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showSecondModal, setShowSecondModal] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleAddressChange = (field: keyof Address, value: any) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      address: {
        ...prevFormData.address,
        [field]: value,
      },
    }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateFields(formData, setErrors)) {
      setShowSecondModal(true);
    }
  };

  const handleFinalSubmit = (updatedData: BeneficiaryForm) => {
    if (isEditing && initialFormData) {
      // Preserve the original id and dateCreated if editing
      onSubmit({
        ...updatedData,
        id: initialFormData.id,
        dateCreated: initialFormData.dateCreated,
      });
    } else {
      // Handle creation of a new beneficiary
      onSubmit(updatedData);
    }
    onClose();
  };

  const handleBack = () => {
    setShowSecondModal(false);
  };

  return (
    <>
      {!showSecondModal ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-full max-h-[90%] overflow-auto max-w-screen-lg mx-4 my-6 relative">
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-700"
            >
              ✖
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-900">
              {isEditing ? "Edit Beneficiary" : "Add Beneficiary"}
            </h2>
            <ProgressBar currentStep={1} />
            <form className="overflow-y-auto" onSubmit={handleNext}>
              {/* Calamity Dropdown */}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {BeneficiaryInputFields.filter(
                  (field) =>
                    field.name !== "houseNumber" &&
                    field.name !== "calamityName"
                ).map((field) => (
                  <div key={field.name} className="flex flex-col">
                    <label className="mb-1 font-semibold text-gray-800">
                      {field.label}
                      {!field.optional && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>
                    {dropdownFields.some((f) => f.name === field.name) ? (
                      <select
                        name={field.name}
                        value={(formData as any)[field.name]}
                        onChange={handleChange}
                        className={`p-2 border border-gray-300 rounded text-gray-700 ${
                          errors[field.name] ? "border-red-500" : ""
                        }`}
                      >
                        <option value="">Select {field.label}</option>
                        {dropdownFields
                          .find((f) => f.name === field.name)
                          ?.options.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                      </select>
                    ) : (
                      <input
                        name={field.name}
                        type={field.name === "email" ? "email" : "text"}
                        value={(formData as any)[field.name]}
                        onChange={handleChange}
                        className={`p-2 border border-gray-300 rounded text-gray-700 ${
                          errors[field.name] ? "border-red-500" : ""
                        }`}
                        placeholder={`Please enter ${field.label.toLowerCase()}`}
                      />
                    )}
                    {errors[field.name] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[field.name]}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <h1 className="mb-2 pt-2 pb-2 text-xl font-semibold text-gray-800 border-t-2 my-4">
                Address
              </h1>

              <DropdownAddress
                address={formData.address}
                setAddress={handleAddressChange}
                regions={regions}
                provinces={provinces}
                municipalities={municipalities}
                barangays={barangays}
                errors={errors}
              />
              {/* House number field to address section */}
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                {BeneficiaryInputFields.filter(
                  (field) => field.name === "houseNumber"
                ).map((field) => (
                  <div key={field.name} className="flex flex-col mt-2">
                    <label className="mb-1 font-semibold text-gray-800">
                      {field.label}
                      {!field.optional && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>
                    <input
                      name={field.name}
                      type={field.name === "email" ? "email" : "text"}
                      value={(formData as any)[field.name]}
                      onChange={handleChange}
                      className={`p-2 border border-gray-300 rounded text-gray-700 ${
                        errors[field.name] ? "border-red-500" : ""
                      }`}
                      placeholder={`Please enter ${field.label.toLowerCase()}`}
                    />
                    {errors[field.name] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[field.name]}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Next
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        // Second part of the modal for additional information (if needed)
        <CheckboxGroupModal
          isEditing={isEditing}
          formData={formData}
          onChange={setFormData}
          onSubmit={handleFinalSubmit}
          onClose={onClose}
          onBack={handleBack}
          brgyName={brgyName}
        />
      )}
    </>
  );
};

export default BeneficiaryModal;
