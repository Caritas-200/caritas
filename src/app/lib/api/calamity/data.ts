import {
  collection,
  setDoc,
  doc,
  getDocs,
  deleteDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/app/services/firebaseConfig";

// Function to add a new calamity
export const addCalamity = async (calamityId: string, calamityData: any) => {
  try {
    await setDoc(doc(db, "calamity", calamityId), calamityData);
  } catch (error) {
    console.error("Error adding calamity: ", error);
  }
};

// Function to fetch all Calamity
export const getAllCalamity = async () => {
  try {
    // Reference to the "calamity" collection
    const CalamityRef = collection(db, "calamity");

    // Get all documents in the "calamity" collection
    const snapshot = await getDocs(CalamityRef);

    // Map through the snapshot to get an array of calamity objects
    const Calamity = snapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      calamityType: doc.data().calamityType,
      ...doc.data(),
    }));

    return Calamity;
  } catch (error) {
    console.error("Error fetching Calamity: ", error);
    return [];
  }
};

export const deleteCalamity = async (calamityId: string) => {
  try {
    await deleteDoc(doc(db, "calamity", calamityId));
  } catch (error) {
    console.error("Error deleting calamity: ", error);
  }
};

export const updateQualificationStatus = async (
  id: string,
  selectedBarangay: string,
  isQualified: boolean
) => {
  try {
    const docRef = doc(db, `barangay/${selectedBarangay}/recipients`, id);
    await updateDoc(docRef, {
      isQualified,
      dateVerified: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating qualification status:", error);
    throw error;
  }
};
