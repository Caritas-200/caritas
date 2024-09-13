import React, { useState, useEffect } from "react";
import { countries, formFields, dropDownFields } from "@/app/config/donors";
import { DonorFormData, DonorType } from "@/app/lib/definitions";
import { validateDonorForm } from "@/app/util/validateDonorForm";
import { SelectField } from "../SelectedField";
import { InputField } from "../InputField";
import { addDonor } from "@/app/lib/api/donor/data";
import Swal from "sweetalert2";
import { Timestamp } from "firebase/firestore";
import { updateDonor } from "@/app/lib/api/donor/data";

const AddDonorModal: React.FC<{
  onClose: () => void;
  initialFormData?: DonorFormData | null; // Accept initial form data for editing
  isEditing?: boolean; // Flag to check if it's editing mode
}> = ({ onClose, initialFormData = null, isEditing = false }) => {
  const [formData, setFormData] = useState<DonorFormData>({
    dateCreated: Timestamp.now(),
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

  // Populate form data when editing
  useEffect(() => {
    if (initialFormData && isEditing) {
      setFormData(initialFormData); // Populate form fields for editing
    }
  }, [initialFormData, isEditing]);

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
      if (isEditing && formData.id) {
        // Update donor data if editing
        await updateDonor(formData.id, formData);
        Swal.fire("Success", "Donor updated successfully!", "success");
      } else {
        // Add new donor if not editing
        await addDonor(formData);
        Swal.fire("Success", "Donor added successfully!", "success");
      }

      // Close modal after save
      onClose();
    } catch (error) {
      Swal.fire("Error", `${error}`);
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
          {isEditing ? "Edit Donor" : "Add New Donor"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-700">
            {formFields.map(({ id, name, label, type, placeholder }) => (
              <div key={id}>
                <InputField
                  id={id}
                  name={name}
                  type={type}
                  value={formData[name as keyof DonorType]}
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
                  value={formData[name as keyof DonorType]}
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
              {isEditing ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDonorModal;
