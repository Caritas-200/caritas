import {
  setDoc,
  doc,
  Timestamp,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/app/services/firebaseConfig";
import { BeneficiaryForm } from "@/app/lib/definitions";

// Function to add a new beneficiary
export const addBeneficiary = async (
  formData: BeneficiaryForm,
  brgyName: string
): Promise<void> => {
  try {
    // Reference to the recipients collection under the specified barangay document
    const recipientsCollectionRef = collection(
      db,
      `barangay/${brgyName}/recipients`
    );

    // Query to check for existing beneficiary with the same firstName, lastName, and middleName
    const duplicateQuery = query(
      recipientsCollectionRef,
      where("firstName", "==", formData.firstName),
      where("lastName", "==", formData.lastName),
      where("middleName", "==", formData.middleName)
    );

    const querySnapshot = await getDocs(duplicateQuery);

    if (!querySnapshot.empty) {
      // Duplicate found
      throw new Error("A beneficiary with the same name already exists.");
    }

    // Generate a new document reference within the recipients collection
    const newBeneficiaryRef = doc(recipientsCollectionRef);

    // Set the document with the form data and a timestamp
    await setDoc(newBeneficiaryRef, {
      ...formData,
      dateCreated: Timestamp.now(),
    });

    console.log("Beneficiary added successfully!");
  } catch (error: unknown) {
    // Type guard for Error object
    if (error instanceof Error) {
      console.error("Error adding beneficiary: ", error.message);
      throw error; // Re-throw the error to handle it in the UI
    } else {
      console.error("Unknown error adding beneficiary");
      throw new Error("Unknown error adding beneficiary");
    }
  }
};
