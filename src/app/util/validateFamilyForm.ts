import { SetStateAction } from "react";
import { FamilyMember } from "../lib/definitions";

export const validateFamilyForm = (
  members: FamilyMember[],
  setIsValid: { (value: SetStateAction<boolean>): void; (arg0: boolean): void }
) => {
  const isFormValid = members.every((member) => {
    const { name, relation, age, gender, civilStatus } = member;
    const isAgeValid = Number(age) >= 10 && Number(age) <= 100;
    const isAnyFieldFilled =
      name.trim() !== "" ||
      relation !== "" ||
      age !== "" ||
      gender !== "" ||
      civilStatus !== "";
    const isComplete = isAnyFieldFilled
      ? name.trim() !== "" &&
        relation !== "" &&
        isAgeValid &&
        gender !== "" &&
        civilStatus !== ""
      : true;

    return isComplete;
  });

  setIsValid(isFormValid);
};
