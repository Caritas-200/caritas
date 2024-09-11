import firebase from "firebase/compat/app";

export const uploadToFirebaseStorage = async (
  base64Image: string,
  filePath: string
) => {
  const response = await fetch(base64Image);
  const blob = await response.blob();

  const storageRef = firebase.storage().ref();
  const fileRef = storageRef.child(filePath);

  await fileRef.put(blob); // Upload the blob to Firebase Storage
  const url = await fileRef.getDownloadURL(); // Get the HTTP URL

  return url; // Return the download URL
};
