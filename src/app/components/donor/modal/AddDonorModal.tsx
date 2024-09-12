import React, { useState } from "react";
import { countries, formFields, selectFields } from "@/app/config/donors";
import { DonorFormData } from "@/app/lib/definitions";
import { validateDonorForm } from "@/app/util/validateDonorForm";
import { SelectField } from "../SelectedField";
import { InputField } from "../InputField";

const AddDonorModal: React.FC<{
  onClose: () => void;
  onSave: (data: DonorFormData) => void;
}> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState<DonorFormData>({
    firstName: "",
    middleName: "",
    lastName: "",
    mobileNumber: "",
    age: "",
    address: "",
    country: "",
    gender: "",
    work: "",
    civilStatus: "",
    language: "",
    religion: "",
    email: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name as keyof DonorFormData]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateDonorForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Set errors if any
      return;
    }

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-4xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-700"
        >
          ✖
        </button>

        <h2 className="text-xl font-bold mb-4 text-center text-gray-900">
          Add New Donor
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-700">
            {formFields.map(
              ({ id, name, label, type, required, placeholder, pattern }) => (
                <div key={id}>
                  <InputField
                    id={id}
                    name={name}
                    type={type}
                    value={formData[name as keyof DonorFormData]}
                    onChange={handleChange}
                    label={label}
                    required={required}
                    placeholder={placeholder}
                    pattern={pattern}
                  />
                  {errors[name] && (
                    <p className="text-red-500 text-sm">{errors[name]}</p>
                  )}
                </div>
              )
            )}
            {selectFields.map(({ id, name, label, options, required }) => (
              <div key={id}>
                <SelectField
                  id={id}
                  name={name}
                  value={formData[name as keyof DonorFormData]}
                  options={options}
                  onChange={handleChange}
                  label={label}
                  required={required}
                />
                {errors[name] && (
                  <p className="text-red-500 text-sm">{errors[name]}</p>
                )}
              </div>
            ))}
            <div>
              <SelectField
                id="country"
                name="country"
                value={formData.country}
                options={countries}
                onChange={handleChange}
                label="Country"
                required
              />
              {errors.country && (
                <p className="text-red-500 text-sm">{errors.country}</p>
              )}
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDonorModal;
