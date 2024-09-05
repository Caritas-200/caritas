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
    "civilStatus",
    "religion",
  ];

  requiredFields.forEach((field) => {
    if (!formData[field]) {
      newErrors[field] = "This field is required.";
      console.error(`Validation error: ${field} is required but is missing.`);
    }
  });

  // Validate email format
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (formData.email && !emailPattern.test(formData.email)) {
    newErrors.email = "Invalid email address.";
    console.error(
      `Validation error: Invalid email format for ${formData.email}`
    );
  }

  // Validate mobile number format
  const mobilePattern = /^[0-9]{11}$/; // Should be 11 digits
  if (formData.mobileNumber && !mobilePattern.test(formData.mobileNumber)) {
    newErrors.mobileNumber = "Mobile number must be 11 digits.";
    console.error(
      `Validation error: Invalid mobile number format for ${formData.mobileNumber}`
    );
  }

  // Validate age range
  const agePattern = /^(1[0-9]|[2-9][0-9]|100)$/;
  if (formData.age && !agePattern.test(formData.age)) {
    newErrors.age = "Age must be a number between 10 and 100.";
    console.error(`Validation error: Invalid age value ${formData.age}`);
  }

  // Log form data changes if fields are updated
  Object.keys(formData).forEach((field) => {
    if (
      !(field in requiredFields) &&
      formData[field as keyof BeneficiaryForm]
    ) {
      console.log(
        `Field change detected: ${field} has been added or modified with value ${
          formData[field as keyof BeneficiaryForm]
        }`
      );
    }
  });

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
