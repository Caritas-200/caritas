import { Timestamp, doc, setDoc, getDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/app/services/firebaseConfig"; // Ensure you import your Firestore configuration
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // New imports for Storage

// Function to upload a file to Firebase Storage
const uploadFileToStorage = async (
  file: File,
  documentName: string
): Promise<{ name: string; url: string }> => {
  const storage = getStorage(); // Initialize storage
  const storageRef = ref(
    storage,
    `documentation/${documentName}/media/${file.name}`
  ); // Create a reference

  // Upload the file
  await uploadBytes(storageRef, file); // Use uploadBytes to upload the file

  // Get the file URL
  const fileURL = await getDownloadURL(storageRef); // Get the download URL
  return { name: file.name, url: fileURL }; // Returning an object with file name and URL
};

// Function to add media files to Firestore for a specific document
export const addMediaFiles = async (
  documentName: string,
  mediaFiles: File[]
): Promise<void> => {
  try {
    const mediaFilePromises = mediaFiles.map(async (file) => {
      const fileData = await uploadFileToStorage(file, documentName);
      return fileData; // Assuming `uploadFileToStorage` returns file URL or relevant data
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
