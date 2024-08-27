import { auth } from "@/app/services/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { revalidatePath } from "next/cache";

export async function login(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Here you can set cookies or session if needed
    // ...

    // revalidatePath("/home"); // Optionally revalidate cache for certain paths

    return { error: false, user };
  } catch (error: any) {
    return {
      error: true,
      message: error.message,
      status: error.code,
    };
  }
}
