import React, { useState } from "react";
import { BeneficiaryForm } from "@/app/lib/definitions";
import { addBeneficiary } from "@/app/lib/api/beneficiary/data";
import { showLoading, hideLoading } from "../loading";
import { checkboxGroup, radioGroups } from "@/app/config/formConfig";
import Swal from "sweetalert2"; // Import SweetAlert2

interface CheckboxGroupModalProps {
  formData: BeneficiaryForm;
  onChange: (formData: BeneficiaryForm) => void;
  onSubmit: (data: BeneficiaryForm) => void;
  onClose: () => void;
  onBack: () => void;
  brgyName: string;
}

const CheckboxGroupModal: React.FC<CheckboxGroupModalProps> = ({
  formData,
  onChange,
  onSubmit,
  onClose,
  onBack,
  brgyName,
}) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const key = name as keyof BeneficiaryForm;
    onChange({
      ...formData,
      [key]: [value],
    });
    setErrors({ ...errors, [name]: "" });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    const key = name as keyof BeneficiaryForm;

    if (value === "None" && checked) {
      onChange({
        ...formData,
        [key]: ["None"],
      });
    } else {
      onChange({
        ...formData,
        [key]: checked
          ? [
              ...(formData[key] as string[]).filter((item) => item !== "None"),
              value,
            ]
          : (formData[key] as string[]).filter((item) => item !== value),
      });
    }
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.housingCondition.length) {
      newErrors.housingCondition = "Housing Condition is required.";
    }
    if (!formData.healthCondition.length) {
      newErrors.healthCondition = "Health Condition is required.";
    }
    if (!formData.vulnerableGroup.length) {
      newErrors.vulnerableGroup = "Vulnerable Group is required.";
    }
    if (!formData.ownershipRentalType.length) {
      newErrors.ownershipRentalType = "Ownership/Rental Type is required.";
    }
    if (!formData.casualty.length) {
      newErrors.casualty = "Casualty is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      Swal.fire({
        title: "Saving...",
        text: "Please wait while we save the beneficiary data.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        await addBeneficiary(formData, brgyName);
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Beneficiary added successfully.",
        }).then(() => {
          onClose(); // Close the modal after the success message
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          Swal.fire({
            icon: "error",
            title: "Duplicate Found",
            text: error.message,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "An unknown error occurred while adding the beneficiary.",
          });
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg w-full max-w-screen-lg mx-4 my-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-700"
        >
          ✖
        </button>
        <h2 className="text-2xl font-bold mb-4 pb-4 text-center text-gray-900">
          Add New Beneficiary (Last Form)
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {radioGroups.map((group) => (
              <div className="col-span-2 md:col-span-1" key={group.name}>
                <label className="block mb-2 font-semibold text-gray-800">
                  {group.label} <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {group.options.map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-2 text-gray-800"
                    >
                      <input
                        name={group.name as string}
                        type="radio"
                        value={option}
                        checked={(formData[group.name] as string[]).includes(
                          option
                        )}
                        onChange={handleRadioChange}
                        className={`form-radio ${
                          errors[group.name] ? "border-red-500" : ""
                        }`}
                      />
                      {option}
                    </label>
                  ))}
                </div>
                {errors[group.name] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[group.name]}
                  </p>
                )}
              </div>
            ))}

            <div className="col-span-2 md:col-span-1">
              <label className="block mb-2 font-semibold text-gray-800">
                {checkboxGroup.label} <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {checkboxGroup.options.map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-2 text-gray-800"
                  >
                    <input
                      name={checkboxGroup.name as string}
                      type="checkbox"
                      value={option}
                      checked={(
                        formData[checkboxGroup.name] as string[]
                      ).includes(option)}
                      disabled={
                        option !== "None" &&
                        (formData[checkboxGroup.name] as string[]).includes(
                          "None"
                        )
                      }
                      onChange={handleCheckboxChange}
                      className={`form-checkbox ${
                        errors[checkboxGroup.name] ? "border-red-500" : ""
                      }`}
                    />
                    {option}
                  </label>
                ))}
              </div>
              {errors[checkboxGroup.name] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[checkboxGroup.name]}
                </p>
              )}
            </div>
          </div>
          <div className="mt-4 flex justify-center gap-4">
            <button
              type="button"
              onClick={onBack}
              className="bg-gray-500 text-white py-2 px-4 rounded-lg"
            >
              Back
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-lg"
            >
              Add Beneficiary
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckboxGroupModal;
