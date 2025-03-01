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
  getDoc,
} from "firebase/firestore";
import { db, storage } from "@/app/services/firebaseConfig";
import { BeneficiaryForm, CalamityBeneficiary } from "../../definitions";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

// Function to add a new calamity
export const addCalamity = async (calamityId: string, calamityData: any) => {
  try {
    await setDoc(doc(db, "calamity", calamityId), calamityData);
  } catch (error) {
    console.error("Error adding calamity:", error);
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
    console.error("Error fetching calamities:", error);
    return [];
  }
};

export const deleteCalamity = async (calamityId: string) => {
  try {
    await deleteDoc(doc(db, "calamity", calamityId));
  } catch (error) {
    console.error("Error deleting calamity:", error);
  }
};

export const updateQualificationStatus = async (
  id: string,
  isQualified: boolean,
  calamityData: { name: string; calamityType: string } | null,
  beneficiaryName: string,
  brgyName: string
) => {
  try {
    // Prepare the update data
    const updateData: { [key: string]: any } = {
      isQualified,
      dateVerified: Timestamp.now(),
    };

    // Conditionally include calamity data only if isQualified is true
    if (isQualified && calamityData) {
      updateData.calamity = calamityData.calamityType;
      updateData.calamityName = calamityData.name;

      // Add recipient to calamity collection
      const calamityRecipientRef = doc(
        db,
        `calamity/${calamityData.name}/recipients`,
        id
      );
      await setDoc(calamityRecipientRef, {
        isClaimed: false,
        isQualified: true,
        beneficiaryName: beneficiaryName,
        brgyName: brgyName,
        ...updateData,
      });
    } else {
      updateData.calamity = "";
      updateData.calamityName = "";

      // Remove recipient from calamity collection
      const calamityRecipientRef = doc(
        db,
        `calamity/${calamityData?.name}/recipients`,
        id
      );
      await deleteDoc(calamityRecipientRef);
    }
  } catch (error) {
    console.error("Error updating qualification status:", error);
    throw error;
  }
};

export const fetchBeneficiariesByCalamity = async (
  calamityName: string
): Promise<BeneficiaryForm[]> => {
  try {
    // Reference the recipients subcollection under the specified calamity
    const recipientsCollectionRef = collection(
      db,
      `calamity/${calamityName}/recipients`
    );

    // Query recipients based on isQualified and isClaimed
    const q = query(
      recipientsCollectionRef,
      where("isQualified", "==", true),
      where("isClaimed", "==", false)
    );

    const recipientsSnapshot = await getDocs(q);

    // Map the documents to the beneficiaries list
    const beneficiaries = recipientsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as unknown as BeneficiaryForm[];

    return beneficiaries;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching beneficiaries:", error);
      throw error; // Re-throw to handle it in the UI
    } else {
      throw new Error("Unknown error occurred");
    }
  }
};

export const fetchBeneficiaryByCalamityAndId = async (
  calamityName: string,
  beneficiaryId: string
): Promise<CalamityBeneficiary | null> => {
  try {
    // Reference to the specific beneficiary document in the calamity collection
    const beneficiaryDocRef = doc(
      db,
      `calamity/${calamityName}/recipients`,
      beneficiaryId
    );

    // Fetch the beneficiary document
    const beneficiaryDoc = await getDoc(beneficiaryDocRef);

    if (beneficiaryDoc.exists()) {
      // Return the beneficiary data
      return {
        id: beneficiaryDoc.id,
        ...beneficiaryDoc.data(),
      } as CalamityBeneficiary;
    } else {
      console.error("No such document!");
      return null;
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching beneficiary:", error);
      throw error;
    } else {
      throw new Error("Unknown error occurred while fetching beneficiary");
    }
  }
};

// Function to check if recipients are qualified
export const checkRecipientsQualification = async (
  recipientIDs: string[],
  calamityName: string
): Promise<
  {
    id: string;
    isQualified: boolean;
    isClaimed: boolean;
    dateVerified: Timestamp;
  }[]
> => {
  try {
    const recipientsCollectionRef = collection(
      db,
      `calamity/${calamityName}/recipients`
    );

    // Fetch all recipients in the calamity's recipients collection
    const snapshot = await getDocs(recipientsCollectionRef);

    // Map through the snapshot to get an array of recipient objects
    const recipients = snapshot.docs.map((doc) => ({
      id: doc.id,
      isQualified: doc.data().isQualified,
      isClaimed: doc.data().isClaimed,
      dateVerified: doc.data().dateVerified,
    }));

    // Filter the recipients based on the provided recipientIDs
    const qualifiedRecipients = recipients.filter((recipient) =>
      recipientIDs.includes(recipient.id)
    );

    return qualifiedRecipients;
  } catch (error) {
    console.error("Error checking recipients qualification:", error);
    throw error;
  }
};

export const updateVerifiedBeneficiary = async (
  beneficiaryId: string,
  newFields: Record<string, any>,
  calamityName: string,
  isClaimed: boolean,
  imageFile: File | null,
  housingCondition: string,
  casualty: string,
  healthCondition: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    // Reference to the specific beneficiary document in the calamity collection
    const beneficiaryDocRef = doc(
      db,
      `calamity/${calamityName}/recipients`,
      beneficiaryId
    );

    // Fetch the existing beneficiary data
    const beneficiaryDoc = await getDoc(beneficiaryDocRef);

    // Check if the status is already 'claimed'
    const existingData = beneficiaryDoc.data();
    if (existingData?.isClaimed) {
      return { success: false, message: "Benefits are already claimed." };
    }

    let imageUrl: string | null = null;

    // Upload image if present using a promise
    if (imageFile) {
      const storageRef = ref(
        storage,
        `claimantImage/${beneficiaryId}/${imageFile.name}`
      );
      imageUrl = await new Promise<string>((resolve, reject) => {
        uploadBytes(storageRef, imageFile)
          .then(async () => {
            const url = await getDownloadURL(storageRef);
            resolve(url); // Resolve with the image URL
          })
          .catch((error) => reject(error)); // Handle any upload errors
      });
    }

    // Prepare the update data, including the image URL if available
    const updateData = {
      ...newFields,
      isClaimed: isClaimed,
      dateClaimed: Timestamp.now(),
      claimantImage: imageUrl,
      housingCondition,
      casualty,
      healthCondition,
    };

    // Update the document with the new data
    await updateDoc(beneficiaryDocRef, updateData);

    return { success: true, message: "Beneficiary updated successfully." };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    } else {
      return { success: false, message: "Unknown error updating beneficiary" };
    }
  }
};
