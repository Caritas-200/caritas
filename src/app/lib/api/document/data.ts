import { Timestamp, doc, setDoc } from "firebase/firestore";
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

    // Save the uploaded files in Firestore under the specified document
    const docRef = doc(db, "documentation", documentName);

    await setDoc(
      docRef,
      {
        mediaFiles: uploadedFiles,
        updatedAt: Timestamp.now(),
      },
      { merge: true }
    ); // Merge to avoid overwriting existing data

    console.log("Media files added successfully:", uploadedFiles);
  } catch (error) {
    console.error("Error adding media files: ", error);
  }
};
