import {
  Timestamp,
  collection,
  setDoc,
  doc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/app/services/firebaseConfig";

// Function to add a new documentation folder
export const addFolder = async (folderId: string, folderData: any) => {
  try {
    // Add the new folder document in the "documentation" collection
    await setDoc(doc(db, "documentation", folderId), {
      ...folderData,
      createdAt: Timestamp.now(), // Add a timestamp for when the folder was created
    });
  } catch (error) {
    console.error("Error adding document folder: ", error);
  }
};

// Function to fetch all documentation folders
export const getAllFolders = async () => {
  try {
    // Reference to the "documentation" collection
    const foldersRef = collection(db, "documentation");

    // Get all documents in the "documentation" collection
    const snapshot = await getDocs(foldersRef);

    // Map through the snapshot to get an array of folder objects
    const folders = snapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      ...doc.data(),
    }));

    return folders;
  } catch (error) {
    console.error("Error fetching document folders: ", error);
    return [];
  }
};

// Function to delete a documentation folder
export const deleteFolder = async (folderId: string) => {
  try {
    // Delete the specified folder document from the "documentation" collection
    await deleteDoc(doc(db, "documentation", folderId));
  } catch (error) {
    console.error("Error deleting document folder: ", error);
  }
};
