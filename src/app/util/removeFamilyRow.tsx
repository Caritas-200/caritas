import Swal from "sweetalert2";
import { validateFamilyForm } from "./validateFamilyForm";

export const removeFamilyMember = (
  index: number,
  familyMembers: any[],
  setFamilyMembers: (arg0: any) => void,
  setIsValid: any
) => {
  Swal.fire({
    title: "Are you sure?",
    text: "This action will permanently remove the family member row.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      const updatedMembers = familyMembers.filter(
        (_: any, i: number) => i !== index
      );
      setFamilyMembers(updatedMembers);
      Swal.fire(
        "Deleted!",
        "The family member row has been removed.",
        "success"
      );
      validateFamilyForm(updatedMembers, setIsValid);
    }
  });
};
