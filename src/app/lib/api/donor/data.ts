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
import { DonorFormData } from "@/app/lib/definitions";

export const addDonor = async (formData: DonorFormData): Promise<string> => {
  try {
    const donorsCollectionRef = collection(db, "donors");

    // Check for donor duplication using email and name
    const duplicateEmailQuery = query(
      donorsCollectionRef,
      where("email", "==", formData.email),
      where("lastName", "==", formData.lastName),
      where("firstName", "==", formData.firstName)
    );
    const emailSnapshot = await getDocs(duplicateEmailQuery);
    if (!emailSnapshot.empty) {
      throw new Error("A donor with the same email already exists.");
    }

    // Generate a new document reference and save the donor data
    const newDonorRef = doc(donorsCollectionRef);

    const formDataWithId = {
      ...formData,
      status: "active",
      id: newDonorRef.id,
      dateCreated: Timestamp.now(),
    };

    // Save donor data with auto-generated ID and timestamp
    await setDoc(newDonorRef, formDataWithId);

    // Return the newly created document ID
    return newDonorRef.id;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error adding donor: ", error.message);
      throw error;
    } else {
      throw new Error("Unknown error adding donor");
    }
  }
};

// Define the fetchDonors function
export const fetchDonors = async () => {
  try {
    // Get the reference to the "donors" collection
    const donorsCollectionRef = collection(db, "donors");

    // Create a query to fetch all donors (you can add conditions here if necessary)
    const donorsQuery = query(donorsCollectionRef);

    // Execute the query and get the snapshot of donors
    const donorsSnapshot = await getDocs(donorsQuery);

    // Map over the snapshot to return an array of donors
    const donorsData = donorsSnapshot.docs.map((doc) => ({
      id: doc.id, // Add document ID
      ...doc.data(), // Spread the rest of the donor data
    })) as DonorFormData[];

    return donorsData;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching donors: ", error.message);
      throw error;
    } else {
      throw new Error("Unknown error fetching donors");
    }
  }
};
