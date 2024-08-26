import { auth } from "@/app/services/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

interface LoginResponse {
  message: string;
  error: boolean;
  status: number;
}

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    await signInWithEmailAndPassword(auth, email, password);

    return {
      message: "Login success!",
      error: false,
      status: 200,
    };
  } catch (error: any) {
    return {
      error: true,
      message: error.message,
      status: error.code,
    };
  }
};
