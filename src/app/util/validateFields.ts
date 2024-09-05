import { BeneficiaryForm } from "../lib/definitions";
type SetErrors = (errors: { [key: string]: string }) => void;

export const validateFields = (
  formData: BeneficiaryForm,
  setErrors: SetErrors
): boolean => {
  const newErrors: { [key: string]: string } = {};
  const requiredFields: (keyof BeneficiaryForm)[] = [
    "firstName",
    "lastName",
    "mobileNumber",
    "age",
    "address",
    "gender",
    "status",
    "religion",
  ];

  requiredFields.forEach((field) => {
    if (!formData[field]) {
      newErrors[field] = "This field is required.";
    }
  });

  // Validate email format
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (formData.email && !emailPattern.test(formData.email)) {
    newErrors.email = "Invalid email address.";
  }

  // Validate mobile number format
  const mobilePattern = /^[0-9]{11}$/; // Changed to 10 digits based on your earlier specification
  if (formData.mobileNumber && !mobilePattern.test(formData.mobileNumber)) {
    newErrors.mobileNumber = "Mobile number must be 10 digits.";
  }

  // Validate age range
  const agePattern = /^(1[0-9]|[2-9][0-9]|100)$/;
  if (formData.age && !agePattern.test(formData.age)) {
    newErrors.age = "Age must be a number between 10 and 100.";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
