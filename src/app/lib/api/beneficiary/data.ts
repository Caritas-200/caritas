import {
  setDoc,
  doc,
  Timestamp,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db, storage } from "@/app/services/firebaseConfig";
import { BeneficiaryForm, UserData } from "@/app/lib/definitions";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const addBeneficiary = async (
  formData: BeneficiaryForm,
  brgyName: string
): Promise<string> => {
  try {
    const recipientsCollectionRef = collection(
      db,
      `barangay/${brgyName}/recipients`
    );

    // Check if houseNumber is filled
    if (formData.houseNumber) {
      const houseNumberQuery = query(
        recipientsCollectionRef,
        where("houseNumber", "==", formData.houseNumber)
      );
      const houseNumberSnapshot = await getDocs(houseNumberQuery);
      if (!houseNumberSnapshot.empty) {
        throw new Error("This house number is already registered.");
      }
    }

    // Check for name duplication
    const duplicateQuery = query(
      recipientsCollectionRef,
      where("firstName", "==", formData.firstName),
      where("lastName", "==", formData.lastName),
      where("middleName", "==", formData.middleName)
    );
    const querySnapshot = await getDocs(duplicateQuery);
    if (!querySnapshot.empty) {
      throw new Error("A beneficiary with the same name already exists.");
    }

    // Generate a new document reference and save the data (without QR code for now)
    const newBeneficiaryRef = doc(recipientsCollectionRef);

    const formDataWithId = {
      ...formData,
      id: newBeneficiaryRef.id,
      status: "unclaimed",
      dateCreated: Timestamp.now(),
    };

    await setDoc(newBeneficiaryRef, formDataWithId);

    // Return the newly created document ID
    return newBeneficiaryRef.id;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error adding beneficiary: ", error.message);
      throw error;
    } else {
      throw new Error("Unknown error adding beneficiary");
    }
  }
};

// Helper function to upload the QR code image to Firebase Storage and return the URL
const uploadQrCodeToStorage = async (
  base64Image: string,
  filePath: string
): Promise<string> => {
  const response = await fetch(base64Image);
  const blob = await response.blob();

  // Reference to the Firebase Storage location
  const storageRef = ref(storage, filePath);

  // Upload the image blob to Firebase Storage
  await uploadBytes(storageRef, blob);

  // Get and return the download URL
  return await getDownloadURL(storageRef);
};

export const updateBeneficiaryWithQrCode = async (
  beneficiaryId: string,
  qrImage: string,
  brgyName: string
): Promise<void> => {
  try {
    const qrCodeUrl = await uploadQrCodeToStorage(
      qrImage,
      `qr-codes/${beneficiaryId}.png`
    );

    const beneficiaryRef = doc(
      db,
      `barangay/${brgyName}/recipients`,
      beneficiaryId
    );

    await updateDoc(beneficiaryRef, {
      qrCode: qrCodeUrl,
    });

    console.log("QR code added successfully!");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error updating beneficiary with QR code: ", error.message);
      throw error;
    } else {
      throw new Error("Unknown error updating beneficiary with QR code");
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

// Function to fetch a specific beneficiary by ID
export const fetchBeneficiaryById = async (
  brgyName: string,
  beneficiaryId: string
): Promise<BeneficiaryForm | null> => {
  try {
    // Reference to the specific document in the beneficiaries collection
    const beneficiaryDocRef = doc(
      db,
      `barangay/${brgyName}/recipients/${beneficiaryId}`
    );

    // Fetch the document
    const docSnapshot = await getDoc(beneficiaryDocRef);

    // Check if the document exists
    if (docSnapshot.exists()) {
      // Map the document data to BeneficiaryForm type
      const beneficiaryData = {
        id: docSnapshot.id,
        ...docSnapshot.data(),
      } as BeneficiaryForm;

      return beneficiaryData;
    } else {
      console.error("Beneficiary not found");
      return null; // Return null if document does not exist
    }
  } catch (error: unknown) {
    // Type guard for Error object
    if (error instanceof Error) {
      console.error("Error fetching beneficiary: ", error.message);
      throw error; // Re-throw the error to handle it in the UI
    } else {
      console.error("Unknown error fetching beneficiary");
      throw new Error("Unknown error fetching beneficiary");
    }
  }
};

export const updateBeneficiary = async (
  beneficiaryId: string, // ID of the beneficiary to update
  updatedFormData: BeneficiaryForm, // New data to update
  brgyName: string // Barangay name
): Promise<void> => {
  try {
    // Reference to the specific beneficiary document using the provided ID
    const beneficiaryDocRef = doc(
      db,
      `barangay/${brgyName}/recipients`,
      beneficiaryId
    );

    // Fetch the existing beneficiary data
    const beneficiaryDoc = await getDoc(beneficiaryDocRef);

    if (!beneficiaryDoc.exists()) {
      throw new Error("Beneficiary does not exist.");
    }

    // Get the current data to ensure id and dateCreated are not changed
    const currentData = beneficiaryDoc.data() as BeneficiaryForm;

    // Merge the existing id and dateCreated with the updated form data
    const updatedBeneficiaryData = {
      ...updatedFormData,
      id: currentData.id, // Ensure the ID is not changed
      dateCreated: currentData.dateCreated, // Ensure the creation date is not changed
      dateUpdated: Timestamp.now(), // Add the dateUpdated field with the current timestamp
    };

    // Update the document with the new data
    await setDoc(beneficiaryDocRef, updatedBeneficiaryData);

    console.log("Beneficiary updated successfully.");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error updating beneficiary: ", error.message);
      throw error;
    } else {
      throw new Error("Unknown error updating beneficiary");
    }
  }
};

export const deleteBeneficiary = async (
  brgyName: string,
  beneficiaryId: string
): Promise<void> => {
  try {
    const beneficiaryDocRef = doc(
      db,
      `barangay/${brgyName}/recipients/${beneficiaryId}`
    );

    // Delete the beneficiary document from Firestore
    await deleteDoc(beneficiaryDocRef);

    console.log(`beneficiary with ID ${beneficiaryId} deleted successfully.`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error deleting beneficiary: ", error.message);
      throw error;
    } else {
      throw new Error("Unknown error occurred while deleting beneficiary");
    }
  }
};

export const verifyRecipient = async (
  brgyName: string,
  beneficiaryId: string
): Promise<{
  found: boolean;
  beneficiaryData: Partial<UserData> | null;
}> => {
  try {
    // Reference to the specific beneficiary document using the provided ID
    const beneficiaryDocRef = doc(
      db,
      `barangay/${brgyName}/recipients/${beneficiaryId}`
    );

    // Fetch the document snapshot, but only select specific fields
    const docSnapshot = await getDoc(beneficiaryDocRef);

    if (docSnapshot.exists()) {
      // Select only the necessary fields
      const beneficiaryData = {
        firstName: docSnapshot.data()?.firstName,
        middleName: docSnapshot.data()?.middleName,
        lastName: docSnapshot.data()?.lastName,
        familyMembers: docSnapshot.data()?.familyMembers,
        dateCreated: docSnapshot.data()?.dateCreated,
        calamityType: docSnapshot.data()?.calamity,
        calamityName: docSnapshot.data()?.calamityName,
      } as Partial<UserData>;

      return { found: true, beneficiaryData };
    } else {
      return { found: false, beneficiaryData: null };
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error verifying beneficiary: ", error.message);
      throw error;
    } else {
      throw new Error("Unknown error occurred while verifying beneficiary");
    }
  }
};

export const updateVerifiedBeneficiary = async (
  beneficiaryId: string,
  newFields: Record<string, any>,
  brgyName: string,
  newStatus: string,
  imageFile: File | null
): Promise<{ success: boolean; message?: string }> => {
  try {
    // Reference to the specific beneficiary document
    const beneficiaryDocRef = doc(
      db,
      `barangay/${brgyName}/recipients`,
      beneficiaryId
    );

    // Fetch the existing beneficiary data
    const beneficiaryDoc = await getDoc(beneficiaryDocRef);

    if (!beneficiaryDoc.exists()) {
      return { success: false, message: "Beneficiary does not exist." };
    }

    // Check if the status is already 'claimed'
    const existingData = beneficiaryDoc.data();
    if (existingData?.status === "claimed") {
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
      status: newStatus,
      dateClaimed: Timestamp.now(),
      claimantImage: imageUrl, // Save the image URL as claimantImage
    };

    // Update the document with the new data
    await updateDoc(beneficiaryDocRef, updateData);

    return { success: true, message: "Beneficiary updated successfully." };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error updating beneficiary: ", error.message);
      return { success: false, message: error.message };
    } else {
      return { success: false, message: "Unknown error updating beneficiary" };
    }
  }
};
