import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/app/services/firebaseConfig";
import { UserProfile } from "@/app/lib/definitions";
import {
  updatePassword,
  updateEmail,
  sendEmailVerification,
  applyActionCode,
} from "firebase/auth";

// Fetch user profile data
export const fetchUserProfile = async (): Promise<UserProfile> => {
  const userId = auth.currentUser?.uid;

  if (!userId) {
    throw new Error("User ID not found");
  }

  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return { ...(userDoc.data() as UserProfile) };
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (updatedData: Partial<UserProfile>) => {
  const userId = auth.currentUser?.uid;
  const user = auth.currentUser;

  if (!userId) {
    throw new Error("User ID not found");
  }

  const userDocRef = doc(db, "users", userId);

  try {
    // Update Firestore user document
    await updateDoc(userDocRef, updatedData);
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error("Failed to update user profile");
  }
};

export const updateUserPassword = async (newPassword: string) => {
  try {
    const user = auth.currentUser;

    if (user) {
      await updatePassword(user, newPassword);

      return {
        message: "Password update success! You have been logged out.",
        error: false,
        status: 200,
      };
    } else {
      throw new Error("No user is currently signed in.");
    }
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong, please try again later.");
  }
};
