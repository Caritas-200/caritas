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
    "occupation",
    "ethnicity",
    "monthlyNetIncome",
  ];

  // Nested validation for the 'address' field
  if (formData.address) {
    const { region, province, cityMunicipality, barangay } = formData.address;

    if (!region || !region.region_id) {
      newErrors["address.region"] = "Region is required.";
    }
    if (!province || !province.province_id) {
      newErrors["address.province"] = "Province is required.";
    }
    if (!cityMunicipality || !cityMunicipality.municipality_id) {
      newErrors["address.cityMunicipality"] = "City/Municipality is required.";
    }
    if (!barangay || !barangay.barangay_id) {
      newErrors["address.barangay"] = "Barangay is required.";
    }
  } else {
    newErrors["address"] = "Complete address is required.";
  }

  // Validate required fields
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

  // Validate monthly income format
  const incomePattern = /^[0-9]+$/; // Should be digits only
  if (
    formData.monthlyNetIncome &&
    !incomePattern.test(formData.monthlyNetIncome)
  ) {
    newErrors.monthlyNetIncome = "Net income must be digits.";
    console.error(
      `Validation error: Invalid monthly net income format for ${formData.monthlyNetIncome}`
    );
  }

  // Validate age range
  const agePattern = /^(1[0-9]|[2-9][0-9]|100)$/;
  if (formData.age && !agePattern.test(formData.age)) {
    newErrors.age = "Age must be a number between 10 and 100.";
    console.error(`Validation error: Invalid age value ${formData.age}`);
  }

  // Validate calamity field
  const calamityOptions = [
    "Typhoon",
    "Earthquake",
    "Flood",
    "Volcanic Eruption",
    "Tsunami",
    "Landslide",
    "Drought",
    "Other",
  ];
  if (formData.calamity && !calamityOptions.includes(formData.calamity)) {
    newErrors.calamity = "Invalid calamity type.";
    console.error(
      `Validation error: Invalid calamity type ${formData.calamity}`
    );
  }

  // Validate calamityName if 'Other' is selected
  if (formData.calamity === "Other" && !formData.calamityName) {
    newErrors.calamityName = "Please specify the calamity.";
    console.error(
      "Validation error: Calamity Name are required if 'Other' is selected."
    );
  }

  // Log form data changes if fields are updated
  Object.keys(formData).forEach((field) => {
    if (
      !(field in requiredFields) &&
      formData[field as keyof BeneficiaryForm]
    ) {
    }
  });

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
