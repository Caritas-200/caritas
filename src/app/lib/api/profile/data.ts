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
    throw new Error("Failed to update user profile");
  }
};

export const updateUserPassword = async (newPassword: string) => {
  try {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("No user is currently signed in.");
    }

    // Function to add a timeout to the updatePassword operation
    const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(
            new Error(
              "Request timed out. Please check your internet connection and try again."
            )
          );
        }, ms);

        promise
          .then((result) => {
            clearTimeout(timeout);
            resolve(result);
          })
          .catch((error) => {
            clearTimeout(timeout);
            reject(error);
          });
      });
    };

    // Add a timeout of 15 seconds (or your desired duration)
    await withTimeout(updatePassword(user, newPassword), 15000);

    return {
      message: "Password update success! You have been logged out.",
      error: false,
      status: 200,
    };
  } catch (error: any) {
    // Customize error messages for better feedback
    if (error.message.includes("timed out")) {
      throw new Error(
        "The password update process took too long. Please try again later."
      );
    } else if (error.message.includes("auth/requires-recent-login")) {
      throw new Error(
        "You need to reauthenticate before changing your password. Please log out and log back in."
      );
    }

    throw new Error("Something went wrong, please try again later.");
  }
};
