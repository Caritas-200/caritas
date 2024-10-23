import { Timestamp, doc, setDoc, getDoc, arrayUnion } from "firebase/firestore";
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

    console.log("Media files added successfully:", newMediaEntries);
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
      console.log("Document not found");
      return [];
    }
  } catch (error) {
    console.error("Error fetching media files: ", error);
    return [];
  }
};
