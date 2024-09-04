import { BeneficiaryForm } from "@/app/lib/definitions";

export const checkboxGroup = {
  label: "Casualty",
  name: "casualty" as keyof BeneficiaryForm,
  options: ["None", "Dead", "Injured", "Missing"],
};

export const radioGroups = [
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
    label: "Vulnerable Group",
    name: "vulnerableGroup" as keyof BeneficiaryForm,
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
