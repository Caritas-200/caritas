import {
  collection,
  setDoc,
  doc,
  getDocs,
  deleteDoc,
  updateDoc,
  Timestamp,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/app/services/firebaseConfig";
import { BeneficiaryForm } from "../../definitions";

// Function to add a new calamity
export const addCalamity = async (calamityId: string, calamityData: any) => {
  try {
    await setDoc(doc(db, "calamity", calamityId), calamityData);
  } catch (error) {}
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
    return [];
  }
};

export const deleteCalamity = async (calamityId: string) => {
  try {
    await deleteDoc(doc(db, "calamity", calamityId));
  } catch (error) {}
};

export const updateQualificationStatus = async (
  id: string,
  selectedBarangay: string,
  isQualified: boolean,
  calamityData: { name: string; calamityType: string } | null
) => {
  try {
    const docRef = doc(db, `barangay/${selectedBarangay}/recipients`, id);

    // Prepare the update data
    const updateData: { [key: string]: any } = {
      isQualified,
      dateVerified: Timestamp.now(),
    };

    // Conditionally include calamity data only if isQualified is true
    if (isQualified && calamityData) {
      updateData.calamity = calamityData.calamityType;
      updateData.calamityName = calamityData.name;
    } else {
      updateData.calamity = "";
      updateData.calamityName = "";
    }

    // Update the document with the prepared data
    await updateDoc(docRef, updateData);
  } catch (error) {
    throw error;
  }
};

export const fetchBeneficiariesByCalamity = async (
  calamityName: string,
  calamity: string
): Promise<BeneficiaryForm[]> => {
  try {
    const barangayCollectionRef = collection(db, "barangay");

    // Fetch all barangay documents
    const barangaySnapshot = await getDocs(barangayCollectionRef);

    const allBeneficiaries: BeneficiaryForm[] = [];

    // Iterate over each barangay
    for (const barangayDoc of barangaySnapshot.docs) {
      const barangayName = barangayDoc.id;

      // Reference the recipients subcollection
      const recipientsCollectionRef = collection(
        db,
        `barangay/${barangayName}/recipients`
      );

      // Query recipients based on calamityName and calamityType
      const q = query(
        recipientsCollectionRef,
        where("calamity", "==", calamity),
        where("calamityName", "==", calamityName)
      );

      const recipientsSnapshot = await getDocs(q);

      // Map the documents to the beneficiaries list
      const beneficiaries = recipientsSnapshot.docs.map((doc) => ({
        id: doc.id,
        barangayName, // Include barangayName for context
        ...doc.data(),
      })) as unknown as BeneficiaryForm[];

      allBeneficiaries.push(...beneficiaries);
    }

    return allBeneficiaries;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error; // Re-throw to handle it in the UI
    } else {
      throw new Error("Unknown error occurred");
    }
  }
};
