import React, { useState } from "react";
import { validateFields } from "@/app/util/validateFields";
import { BeneficiaryForm } from "@/app/lib/definitions";
import CheckboxGroupModal from "./CheckBoxGroupModal";

interface ModalProps {
  onClose: () => void;
  onSubmit: (data: BeneficiaryForm) => void;
}

const BeneficiaryModal: React.FC<ModalProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState<BeneficiaryForm>({
    firstName: "",
    middleName: "",
    lastName: "",
    mobileNumber: "",
    age: "",
    address: "",
    gender: "",
    work: "",
    status: "",
    language: "",
    religion: "",
    email: "",
    housingCondition: [],
    casualty: [],
    healthCondition: [],
    ownershipRentalType: [],
    vulnerableGroup: [],
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showSecondModal, setShowSecondModal] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateFields(formData, setErrors)) {
      setShowSecondModal(true);
    }
  };

  const handleFinalSubmit = (updatedData: BeneficiaryForm) => {
    onSubmit(updatedData);
    onClose();
  };

  const handleBack = () => {
    setShowSecondModal(false);
  };

  const textFields = [
    { name: "firstName", label: "First Name" },
    { name: "middleName", label: "Middle Name", optional: true },
    { name: "lastName", label: "Last Name" },
    { name: "mobileNumber", label: "Mobile Number" },
    { name: "age", label: "Age" },
    { name: "address", label: "Address" },
    { name: "gender", label: "Gender" },
    { name: "work", label: "Work", optional: true },
    { name: "status", label: "Status" },
    { name: "language", label: "Language", optional: true },
    { name: "religion", label: "Religion", optional: true },
    { name: "email", label: "Email", optional: true },
  ];

  const dropdownFields = [
    {
      name: "gender",
      label: "Gender",
      options: ["Male", "Female", "Other"],
    },
    {
      name: "status",
      label: "Status",
      options: ["Single", "Married", "Widowed", "Separated"],
    },
  ];

  return (
    <>
      {!showSecondModal ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-full max-w-screen-lg mx-4 my-6 relative">
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-700"
            >
              ✖
            </button>
            <h2 className="text-2xl font-bold mb-4 pb-4 text-center text-gray-900">
              Add New Beneficiary - Step 1
            </h2>
            <form onSubmit={handleNext}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {textFields.map((field) => (
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
              <div className="mt-4 flex justify-center gap-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                >
                  Next
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <CheckboxGroupModal
          formData={formData}
          onChange={setFormData}
          onSubmit={handleFinalSubmit}
          onClose={onClose}
          onBack={handleBack} // Pass the handleBack function as the onBack prop
        />
      )}
    </>
  );
};

export default BeneficiaryModal;
