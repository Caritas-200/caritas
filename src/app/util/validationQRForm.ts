import Swal from "sweetalert2";

export const validateBenefitForm = (benefitForm: {
  donationType: string[];
}) => {
  if (!benefitForm.donationType.length) {
    Swal.fire({
      title: "Missing Required Fields",
      text: "Please select at least one donation type.",
      icon: "warning",
      confirmButtonText: "OK",
    });
    return false;
  }
  return true;
};

export const validateCapturedImage = (capturedImage: string | null) => {
  if (!capturedImage) {
    Swal.fire({
      title: "Missing Required Fields",
      text: "Please capture an image before submitting.",
      icon: "warning",
      confirmButtonText: "OK",
    });
    return false;
  }
  return true;
};

export const validateConditions = (formData: {
  healthCondition: string;
  housingCondition: string;
  casualty: string;
}) => {
  if (
    !formData.healthCondition ||
    !formData.housingCondition ||
    !formData.casualty
  ) {
    Swal.fire({
      title: "Missing Required Fields",
      text: "Please select all condition fields (Health, Housing, and Casualty).",
      icon: "warning",
      confirmButtonText: "OK",
    });
    return false;
  }
  return true;
};
