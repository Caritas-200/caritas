import {
  Timestamp,
  collection,
  setDoc,
  doc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { auth, db } from "@/app/services/firebaseConfig";

// Function to add a new barangay
export const addBarangay = async (barangayId: string, barangayData: any) => {
  try {
    await setDoc(doc(db, "barangay", barangayId), barangayData);
    console.log("Barangay added successfully!");
  } catch (error) {
    console.error("Error adding barangay: ", error);
  }
};

// Function to fetch all barangays
export const getAllBarangays = async () => {
  try {
    // Reference to the "barangay" collection
    const barangaysRef = collection(db, "barangay");

    // Get all documents in the "barangay" collection
    const snapshot = await getDocs(barangaysRef);

    // Map through the snapshot to get an array of barangay objects
    const barangays = snapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      ...doc.data(),
    }));

    console.log("Fetched Barangays: ", barangays);
    return barangays;
  } catch (error) {
    console.error("Error fetching barangays: ", error);
    return [];
  }
};

export const deleteBarangay = async (barangayId: string) => {
  try {
    await deleteDoc(doc(db, "barangay", barangayId));
    console.log(`Barangay with ID ${barangayId} deleted successfully!`);
  } catch (error) {
    console.error("Error deleting barangay: ", error);
  }
};
