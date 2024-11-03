import { createUserWithEmailAndPassword } from "firebase/auth";
import { Timestamp, setDoc, doc } from "firebase/firestore";
import { auth, db } from "@/app/services/firebaseConfig";

interface SignUpData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  status: string;
  mobileNumber: string;
  gender: string;
  position: string;
  address: string;
  [key: string]: any;
}

interface SignUpResponse {
  message: string;
  error: boolean;
  status: number | string;
}

export const signup = async (data: SignUpData): Promise<SignUpResponse> => {
  let dateCreated = Timestamp.fromDate(new Date());

  try {
    // Signup using createUserWithEmailAndPassword function of Firebase
    await createUserWithEmailAndPassword(auth, data.email, data.password);

    // Get the user object after signup
    const user = auth.currentUser;

    if (!user) {
      throw new Error("User not found after signup.");
    }

    // Use user.uid as the docId
    const userDocRef = doc(db, "users", user.uid);

    // Exclude the password and confirmPassword fields from the data
    const { password, confirmPassword, ...userData } = data;

    // Set the data in the document
    await setDoc(userDocRef, {
      ...userData,
      userId: user.uid,
      dateCreated,
    });

    return {
      message: "Account successfully created!",
      error: false,
      status: 201,
    };
  } catch (error: any) {
    return { error: true, message: error.message, status: error.code };
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await auth.signOut();
    console.log("User logged out successfully.");
    // Additional logic after logout (e.g., redirect to login page)
  } catch (error) {
    console.error("Error logging out:", error);
    throw new Error("Failed to log out user");
  }
};
