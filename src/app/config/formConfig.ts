import { BeneficiaryForm } from "@/app/lib/definitions";

export const inputFieldsSignUp = [
  { label: "First Name", name: "firstName", type: "text", required: true },
  { label: "Middle Name", name: "middleName", type: "text" },
  { label: "Last Name", name: "lastName", type: "text", required: true },
  { label: "Email", name: "email", type: "email", required: true },
  {
    label: "Mobile Number",
    name: "mobileNumber",
    type: "tel",
    required: true,
  },
  { label: "Position", name: "position", type: "text", required: true },
  { label: "Address", name: "address", type: "text", required: true },
  { label: "Password", name: "password", type: "password", required: true },
  {
    label: "Confirm Password",
    name: "confirmPassword",
    type: "password",
    required: true,
  },
];

export const statusOptionsSignUp = ["Single", "Married", "Divorced", "Widowed"];
export const genderOptionsSignUp = ["Male", "Female", "Other"];

export const checkboxGroup = {
  label: "Casualty",
  name: "casualty" as keyof BeneficiaryForm,
  options: ["None", "Dead", "Injured", "Missing"],
};

export const radioGroups = [
  {
    label: "4Ps Beneficiary",
    name: "beneficiary4Ps" as keyof BeneficiaryForm,
    options: ["Yes", "No"],
  },
  {
    label: "Housing Condition",
    name: "housingCondition" as keyof BeneficiaryForm,
    options: ["Partially Damaged", "Totally Damaged"],
  },
  {
    label: "Health Condition",
    name: "healthCondition" as keyof BeneficiaryForm,
    options: ["With Illness", "Without Illness"],
  },
  {
    label: "Code",
    name: "code" as keyof BeneficiaryForm,
    options: [
      "None",
      "Elderly",
      "Lactating Mother",
      "Pregnant Woman",
      "Solo Parent",
      "PWD (Person with Disability)",
    ],
  },
  {
    label: "Ownership/Rental Type",
    name: "ownershipRentalType" as keyof BeneficiaryForm,
    options: [
      "House & lot owner",
      "Rented house & Lot",
      "House owner & Lot Rental",
      "House owner, rent-free lot with owner's consent",
      "House owner, rent-free lot without owner's consent",
      "Rent-free house & lot with owner's consent",
      "Rent-free house & lot without owner's consent",
    ],
  },
];

export const BeneficiaryInputFields = [
  { name: "calamityName", label: "Calamity Name" },
  { name: "firstName", label: "First Name" },
  { name: "middleName", label: "Middle Name", optional: true },
  { name: "lastName", label: "Last Name" },
  { name: "mobileNumber", label: "Mobile Number" },
  { name: "age", label: "Age" },
  { name: "gender", label: "Gender" },
  { name: "occupation", label: "Occupation" },
  { name: "monthlyNetIncome", label: "Monthly Net Income" },
  { name: "civilStatus", label: "Civil Status" },
  { name: "ethnicity", label: "Ethnicity" },
  { name: "religion", label: "Religion" },
  { name: "email", label: "Email", optional: true },
  { name: "houseNumber", label: "House #", optional: true },
];

export const dropdownFields = [
  {
    name: "gender",
    label: "Gender",
    options: ["Male", "Female", "Other"],
  },
  {
    name: "civilStatus",
    label: "Civil Status",
    options: ["Single", "Married", "Widowed", "Separated"],
  },
  {
    name: "ethnicity",
    label: "Ethnicity ",
    options: [
      "Tagalog",
      "Bisaya",
      "Ilocano",
      "Ilonggo",
      "Cebuano",
      "Bikol",
      "Waray",
    ],
  },
  {
    name: "religion",
    label: "Religion",
    options: [
      "Roman Catholicism",
      "Islam",
      "Iglesia ni Cristo",
      "Seventh-day Adventist",
      "Aglipayan Church (Philippine Independent Church)",
      "Iglesia Filipina Independiente",
      "Bible Baptist Church",
      "United Church of Christ in the Philippines",
      "Jehovah's Witnesses",
      "Church of Christ",
      "Other Christian denominations",
      "Indigenous Philippine folk religions",
      "Buddhism",
      "Other religions",
      "No religion",
    ],
  },
];

export const familyInfoFields = [
  {
    label: "Family Member",
    name: "name",
    placeholder: "Enter family member name",
  },
  {
    label: "Relation",
    name: "relation",
    options: [
      "Children",
      "Spouse",
      "Mother",
      "Mother in Law",
      "Father",
      "Father in Law",
    ],
  },
  { label: "Age", name: "age", placeholder: "Enter age" },
  { label: "Gender", name: "gender", options: ["Male", "Female", "Other"] },
  {
    label: "Civil Status",
    name: "civilStatus",
    options: ["Single", "Married", "Divorced", "Widowed"],
  },
  {
    label: "Education",
    name: "education",
    options: [
      "No formal education",
      "Primary",
      "Secondary",
      "GED (General Educational Development)",
      "Vocational qualification",
      "College level",
      "Associate's degree",
      "Bachelor's degree",
      "Master's degree",
      "Professional degree (e.g., MD, JD)",
      "Doctorate degree (e.g., PhD, EdD)",
      "Currently enrolled in high school",
      "Currently enrolled in college",
      "Currently enrolled in a master's program",
      "Currently enrolled in a doctoral program",
    ],
  },

  {
    label: "Occupational Skills",
    name: "skills",
    placeholder: "Enter skills",
  },
  {
    label: "Remarks",
    name: "remarks",
    placeholder: "Additional remarks (optional)",
  },
];
