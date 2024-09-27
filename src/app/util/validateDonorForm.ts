// src/utils/validateDonorForm.ts
import { DonorFormData } from "@/app/lib/definitions";

export const validateDonorForm = (formData: DonorFormData) => {
  const errors: { [key: string]: string } = {};

  // Check for required fields
  const requiredFields: (keyof DonorFormData)[] = [
    "firstName",
    "lastName",
    "mobileNumber",
    "age",
    "address",
    "country",
    "gender",
    "work",
    "civilStatus",
    "email",
    "language",
    "religion",
    "donationType",
  ];

  requiredFields.forEach((field) => {
    if (!formData[field]) {
      errors[field] = `${
        field.charAt(0).toUpperCase() + field.slice(1)
      } is required.`;
    }
  });

  // Email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (formData.email && !emailPattern.test(formData.email)) {
    errors.email = "Please enter a valid email address.";
  }

  // Mobile number validation (11 digits)
  const mobilePattern = /^[0-9]{11}$/;
  if (formData.mobileNumber && !mobilePattern.test(formData.mobileNumber)) {
    errors.mobileNumber = "Please enter a valid 11-digit mobile number.";
  }

  return errors;
};
