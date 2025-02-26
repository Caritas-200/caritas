import {
  Timestamp,
  doc,
  setDoc,
  getDoc,
  arrayUnion,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
import { db } from "@/app/services/firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Function to upload a file to Firebase Storage
const uploadFileToStorage = async (
  file: File,
  documentName: string
): Promise<{ name: string; url: string; type: string }> => {
  const storage = getStorage(); // Initialize storage
  const storageRef = ref(
    storage,
    `documentation/${documentName}/media/${file.name}`
  ); // Create a reference

  // Upload the file
  await uploadBytes(storageRef, file); // Use uploadBytes to upload the file

  // Get the file URL
  const fileURL = await getDownloadURL(storageRef); // Get the download URL

  // Return an object with file name, URL, and type
  return { name: file.name, url: fileURL, type: file.type };
};

// Function to add media files to Firestore for a specific document
export const addMediaFiles = async (
  documentName: string,
  mediaFiles: File[]
): Promise<void> => {
  try {
    const mediaFilePromises = mediaFiles.map(async (file) => {
      const fileData = await uploadFileToStorage(file, documentName);
      return fileData; // File data now includes the type
    });

    const uploadedFiles = await Promise.all(mediaFilePromises);

    // Reference to the Firestore document
    const docRef = doc(db, "documentation", documentName);

    // Get the existing media count from Firestore
    const docSnapshot = await getDoc(docRef);
    let existingCount = 0;

    if (docSnapshot.exists()) {
      // Retrieve the existing media count if it exists
      existingCount = docSnapshot.data().mediaCount || 0;
    }

    // Generate new keys for the uploaded files based on the existing count
    const newMediaEntries = uploadedFiles.map((fileData, index) => ({
      ...fileData,
      order: existingCount + index, // Adjust index to reflect the new position in the array
    }));

    // Update the Firestore document with the new media files and count
    await setDoc(
      docRef,
      {
        mediaFiles: arrayUnion(...newMediaEntries), // Use arrayUnion to avoid fetching the entire array
        mediaCount: existingCount + uploadedFiles.length,
        updatedAt: Timestamp.now(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error adding media files: ", error);
  }
};

// Function to fetch media files for a specific document from Firestore
export const fetchMediaFiles = async (documentName: string): Promise<any[]> => {
  try {
    const docRef = doc(db, "documentation", documentName);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      return data.mediaFiles || []; // Return mediaFiles if they exist
    } else {
      ("Document not found");
      return [];
    }
  } catch (error) {
    console.error("Error fetching media files: ", error);
    return [];
  }
};

// Function to delete a media file from Firestore and Firebase Storage
// Function to delete a media file from Firestore
export const deleteMediaFile = async (
  documentName: string,
  fileName: string
) => {
  try {
    const docRef = doc(db, "documentation", documentName);

    // Retrieve the current document data
    const docSnapshot = await getDoc(docRef);
    if (!docSnapshot.exists()) {
      `Document "${documentName}" does not exist.`;
      return;
    }

    const mediaFiles = docSnapshot.data().mediaFiles || [];

    // Find the exact file object to remove
    const fileToRemove = mediaFiles.find(
      (file: { name: string }) => file.name === fileName
    );
    if (!fileToRemove) {
      `File "${fileName}" not found in the document.`;
      return;
    }

    // Update the document to remove the specified file
    await updateDoc(docRef, {
      mediaFiles: arrayRemove(fileToRemove), // Pass the exact file object for arrayRemove to work
      updatedAt: Timestamp.now(),
    });

    `Media file "${fileName}" deleted successfully from Firestore.`;
  } catch (error) {
    console.error("Error deleting media file: ", error);
  }
};
