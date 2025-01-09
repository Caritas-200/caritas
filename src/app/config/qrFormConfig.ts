import { UserData } from "@/app/lib/definitions";

export const radioGroups = [
  {
    label: "Health Condition",
    name: "healthCondition" as keyof UserData,
    options: ["With Illness", "Without Illness"],
  },
  {
    label: "Housing Condition",
    name: "housingCondition" as keyof UserData,
    options: ["Partially Damaged", "Totally Damaged"],
  },
  {
    label: "Casualty",
    name: "casualty" as keyof UserData,
    options: ["None", "Dead", "Injured", "Missing"],
  },
];
