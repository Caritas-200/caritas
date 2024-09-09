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

    // Check if houseNumber is filled
    if (formData.houseNumber) {
      // Query to check if houseNumber is already registered
      const houseNumberQuery = query(
        recipientsCollectionRef,
        where("houseNumber", "==", formData.houseNumber)
      );

      const houseNumberSnapshot = await getDocs(houseNumberQuery);

      if (!houseNumberSnapshot.empty) {
        // House number already registered, throw an error
        throw new Error("This house number is already registered.");
      }
    }

    // If house number is not filled, check for name duplication
    const duplicateQuery = query(
      recipientsCollectionRef,
      where("firstName", "==", formData.firstName),
      where("lastName", "==", formData.lastName),
      where("middleName", "==", formData.middleName)
    );

    const querySnapshot = await getDocs(duplicateQuery);

    if (!querySnapshot.empty) {
      // Duplicate found based on name
      throw new Error("A beneficiary with the same name already exists.");
    }

    // Generate a new document reference within the recipients collection
    const newBeneficiaryRef = doc(recipientsCollectionRef);

    // Set the document with the form data and a timestamp
    await setDoc(newBeneficiaryRef, {
      ...formData,
      status: "unclaimed",
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

// Function to fetch all beneficiaries for a specific barangay
export const fetchBeneficiaries = async (
  brgyName: string
): Promise<BeneficiaryForm[]> => {
  try {
    // Reference to the recipients collection under the specified barangay document
    const recipientsCollectionRef = collection(
      db,
      `barangay/${brgyName}/recipients`
    );

    // Create a query to fetch all documents in the collection
    const q = query(recipientsCollectionRef);

    // Get the documents
    const querySnapshot = await getDocs(q);

    // Map the documents to an array of beneficiary data
    const beneficiaries = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as BeneficiaryForm[];

    return beneficiaries;
  } catch (error: unknown) {
    // Type guard for Error object
    if (error instanceof Error) {
      console.error("Error fetching beneficiaries: ", error.message);
      throw error; // Re-throw the error to handle it in the UI
    } else {
      console.error("Unknown error fetching beneficiaries");
      throw new Error("Unknown error fetching beneficiaries");
    }
  }
};
