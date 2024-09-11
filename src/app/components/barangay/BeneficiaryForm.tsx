import React, { useState } from "react";
import { validateFields } from "@/app/util/validateFields";
import { BeneficiaryForm } from "@/app/lib/definitions";
import CheckboxGroupModal from "./CheckBoxGroupModal";
import { textFields, dropdownFields } from "@/app/config/formConfig";
import { Timestamp } from "firebase/firestore";

interface ModalProps {
  onClose: () => void;
  onSubmit: (data: BeneficiaryForm) => void;
  brgyName: string;
}

const BeneficiaryModal: React.FC<ModalProps> = ({
  onClose,
  onSubmit,
  brgyName,
}) => {
  const [formData, setFormData] = useState<BeneficiaryForm>({
    id: "",
    dateCreated: Timestamp.now(),
    status: "",
    firstName: "",
    middleName: "",
    lastName: "",
    mobileNumber: "",
    age: "",
    address: "",
    gender: "",
    occupation: "",
    houseNumber: "",
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
              Beneficiary Form ( 1-3 )
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
          onBack={handleBack}
          brgyName={brgyName}
        />
      )}
    </>
  );
};

export default BeneficiaryModal;
