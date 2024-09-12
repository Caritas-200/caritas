import React, { useState } from "react";
import { countries, formFields, dropDownFields } from "@/app/config/donors";
import { DonorFormData } from "@/app/lib/definitions";
import { validateDonorForm } from "@/app/util/validateDonorForm";
import { SelectField } from "../SelectedField";
import { InputField } from "../InputField";
import { addDonor } from "@/app/lib/api/donor/data";
import Swal from "sweetalert2";

const AddDonorModal: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
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
    id: "",
    status: "",
    suffix: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Run validation
    const validationErrors = validateDonorForm(formData);

    // Check if there are any validation errors
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Display errors
      return;
    }

    try {
      // Call the addDonor function
      await addDonor(formData);

      // Show success message and close modal
      Swal.fire("Success", "Donor added successfully!", "success");

      // Close modal after save
      onClose();
    } catch (error) {
      Swal.fire("Error", "Failed to add donor. Please try again.", "error");
    }
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
            {formFields.map(({ id, name, label, type, placeholder }) => (
              <div key={id}>
                <InputField
                  id={id}
                  name={name}
                  type={type}
                  value={formData[name as keyof DonorFormData]}
                  onChange={handleChange}
                  label={label}
                  placeholder={placeholder}
                />
                {errors[name] && (
                  <p className="text-red-500 text-sm">{errors[name]}</p>
                )}
              </div>
            ))}
            {dropDownFields.map(({ id, name, label, options }) => (
              <div key={id}>
                <SelectField
                  id={id}
                  name={name}
                  value={formData[name as keyof DonorFormData]}
                  options={options}
                  onChange={handleChange}
                  label={label}
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
